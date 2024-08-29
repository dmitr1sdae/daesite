use crate::domain::models::id::ID;
use crate::domain::models::session::Session;
use crate::domain::repositories::repository::RepositoryResult;
use crate::domain::repositories::session::SessionRepository;
use crate::infrastructure::connectors::postgres;
use std::sync::Arc;

pub struct SessionPostgresRepository {
    repository: Arc<postgres::Session>,
}

#[async_trait::async_trait]
impl SessionRepository for SessionPostgresRepository {
    async fn create(&self, user_id: ID) -> RepositoryResult<Session> {
        todo!()
    }

    async fn list(&self, user_id: ID) -> RepositoryResult<Vec<Session>> {
        let sessions = sqlx::query_as!(
            Session,
            r#"
            SELECT id, user_id, access_token, refresh_token, created_at, updated_at
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
            SELECT id, user_id, access_token, refresh_token, created_at, updated_at
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
