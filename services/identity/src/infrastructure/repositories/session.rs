use chrono::{DateTime, Duration, Utc};
use rusty_paseto::prelude::*;

use crate::domain::models::id::ID;
use crate::domain::models::session::Session;
use crate::domain::repositories::repository::RepositoryResult;
use crate::domain::repositories::session::SessionRepository;
use crate::infrastructure::connectors::postgres;
use std::sync::Arc;

pub struct SessionPostgresRepository {
    id_generator: id::Generator,
    repository: Arc<postgres::Session>,
    secret_key: Vec<u8>,
}

impl SessionPostgresRepository {
    pub fn new(
        id_generator: id::Generator,
        repository: Arc<postgres::Session>,
        secret_key: Vec<u8>,
    ) -> Self {
        Self {
            id_generator,
            repository,
            secret_key,
        }
    }

    fn generate_token(
        &self,
        session_id: ID,
        user_id: ID,
        exp: DateTime<Utc>,
    ) -> RepositoryResult<String> {
        let key = PasetoSymmetricKey::<V4, Local>::from(Key::from(self.secret_key.as_slice()));

        let builder = PasetoBuilder::<V4, Local>::default()
            .set_claim(CustomClaim::try_from(("uid", user_id.to_string())).unwrap())
            .set_claim(CustomClaim::try_from(("sid", session_id.to_string())).unwrap())
            .set_claim(ExpirationClaim::try_from(exp.to_rfc3339()).unwrap())
            .build(&key)
            .unwrap();

        Ok(builder)
    }
}

#[async_trait::async_trait]
impl SessionRepository for SessionPostgresRepository {
    async fn create(
        &self,
        user_id: ID,
        ip_address: String,
        user_agent: String,
    ) -> RepositoryResult<Session> {
        let session_id = self.id_generator.clone().generate();

        let date_now = Utc::now();
        let access_exp = date_now + Duration::minutes(15);
        let refresh_exp = date_now + Duration::days(60);

        let access_token = self.generate_token(session_id, user_id, access_exp)?;
        let refresh_token = self.generate_token(session_id, user_id, refresh_exp)?;

        let session = sqlx::query_as!(
            Session,
            r#"
            INSERT INTO sessions (id, user_id, access_token, refresh_token, created_at, expires_at, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, user_id, access_token, refresh_token, created_at, expires_at, ip_address, user_agent
            "#,
            session_id,
            user_id,
            access_token,
            refresh_token,
            date_now.timestamp(),
            refresh_exp.timestamp(),
            ip_address,
            user_agent
        )
        .fetch_one(self.repository.as_ref())
        .await
        .unwrap();

        Ok(session)
    }

    async fn list(&self, user_id: ID) -> RepositoryResult<Vec<Session>> {
        let sessions = sqlx::query_as!(
            Session,
            r#"
            SELECT id, user_id, access_token, refresh_token, created_at, expires_at, ip_address, user_agent
            FROM sessions
            WHERE user_id = $1
            "#,
            user_id
        )
        .fetch_all(self.repository.as_ref())
        .await
        .unwrap();

        Ok(sessions)
    }

    async fn get(&self, session_id: ID) -> RepositoryResult<Session> {
        let session = sqlx::query_as!(
            Session,
            r#"
            SELECT id, user_id, access_token, refresh_token, created_at, expires_at, ip_address, user_agent
            FROM sessions
            WHERE id = $1
            "#,
            session_id
        )
        .fetch_one(self.repository.as_ref())
        .await
        .unwrap();

        Ok(session)
    }

    async fn delete(&self, session_id: ID) -> RepositoryResult<()> {
        sqlx::query!(
            r#"
            DELETE FROM sessions WHERE id = $1
            "#,
            session_id
        )
        .execute(self.repository.as_ref())
        .await
        .unwrap();

        Ok(())
    }

    async fn delete_all(&self, user_id: ID) -> RepositoryResult<()> {
        sqlx::query!(
            r#"
            DELETE FROM sessions WHERE user_id = $1
            "#,
            user_id
        )
        .execute(self.repository.as_ref())
        .await
        .unwrap();

        Ok(())
    }
}
