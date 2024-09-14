use crate::domain::models::id::ID;
use crate::domain::models::session::Session;
use crate::domain::repositories::repository::RepositoryResult;
use crate::domain::repositories::session::SessionRepository;
use crate::domain::{error::RepositoryError, models::token_type::TokenType};
use crate::infrastructure::connectors::postgres;
use crate::infrastructure::error::InfrastructureRepositoryError;
use chrono::{DateTime, Duration, Utc};
use rusty_paseto::prelude::*;
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value;
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

    fn validate_token(&self, token: &str) -> RepositoryResult<(ID, ID)> {
        let key = PasetoSymmetricKey::<V4, Local>::from(Key::from(self.secret_key.as_slice()));

        let mut parser = PasetoParser::<V4, Local>::default();

        let claims = parser
            .parse(&token, &key)
            .map_err(|e| RepositoryError::InvalidToken(4000, e.to_string()))?;

        let uid = claims
            .get("uid")
            .ok_or(RepositoryError::InvalidToken(
                4001,
                "Claim 'uid' is missing".to_string(),
            ))?
            .as_i64()
            .ok_or(RepositoryError::InvalidToken(
                4002,
                "Claim 'uid' is not a valid id".to_string(),
            ))?;
        let sid = claims
            .get("sid")
            .ok_or(RepositoryError::InvalidToken(
                4001,
                "Claim 'sid' is missing".to_string(),
            ))?
            .as_i64()
            .ok_or(RepositoryError::InvalidToken(
                4002,
                "Claim 'sid' is not a valid id".to_string(),
            ))?;

        Ok((uid, sid))
    }

    pub fn generate_intermediate_token<T: Serialize>(
        &self,
        user_id: ID,
        token_type: TokenType,
        exp: DateTime<Utc>,
        additional_claims: Option<T>,
    ) -> RepositoryResult<String> {
        let key = PasetoSymmetricKey::<V4, Local>::from(Key::from(self.secret_key.as_slice()));

        let mut paseto_builder = PasetoBuilder::<V4, Local>::default();

        let mut builder = paseto_builder
            .set_claim(
                CustomClaim::try_from(("uid", user_id.to_string())).map_err(|_| {
                    RepositoryError::InvalidToken(4001, "Failed to add 'uid' claim".to_string())
                })?,
            )
            .set_claim(
                CustomClaim::try_from(("type", token_type.to_string())).map_err(|_| {
                    RepositoryError::InvalidToken(4002, "Failed to add 'type' claim".to_string())
                })?,
            )
            .set_claim(ExpirationClaim::try_from(exp.to_rfc3339()).map_err(|_| {
                RepositoryError::InvalidToken(4003, "Failed to add 'exp' claim".to_string())
            })?);

        if let Some(claims) = additional_claims {
            let json_claims = serde_json::to_value(claims).map_err(|e| {
                RepositoryError::InvalidToken(4006, format!("Failed to serialize claims: {}", e))
            })?;

            if let Value::Object(map) = json_claims {
                for (key, value) in map {
                    builder = builder.set_claim(
                        CustomClaim::try_from((key, value.to_string())).map_err(|_| {
                            RepositoryError::InvalidToken(
                                4007,
                                "Failed to add custom claim".to_string(),
                            )
                        })?,
                    );
                }
            }
        }

        let token = builder.build(&key).map_err(|e| {
            RepositoryError::InvalidToken(4008, format!("Failed to build token: {}", e))
        })?;

        Ok(token)
    }

    pub fn validate_intermediate_token<T: DeserializeOwned>(
        &self,
        token: &str,
        expected_token_type: TokenType,
    ) -> RepositoryResult<(ID, T)> {
        let key = PasetoSymmetricKey::<V4, Local>::from(Key::from(self.secret_key.as_slice()));

        let mut parser = PasetoParser::<V4, Local>::default();

        let claims = parser.parse(token, &key).map_err(|e| {
            RepositoryError::InvalidToken(4000, format!("Failed to parse token: {}", e))
        })?;

        let exp_str = claims
            .get("exp")
            .ok_or_else(|| {
                RepositoryError::InvalidToken(4009, "Claim 'exp' is missing".to_string())
            })?
            .as_str()
            .ok_or_else(|| {
                RepositoryError::InvalidToken(4010, "Claim 'exp' is not a valid string".to_string())
            })?;

        let exp = DateTime::parse_from_rfc3339(exp_str)
            .map_err(|_| {
                RepositoryError::InvalidToken(4011, "Failed to parse 'exp' claim".to_string())
            })?
            .with_timezone(&Utc);

        if Utc::now() > exp {
            return Err(RepositoryError::TokenExpired);
        }

        let uid = claims
            .get("uid")
            .ok_or_else(|| {
                RepositoryError::InvalidToken(4001, "Claim 'uid' is missing".to_string())
            })?
            .as_i64()
            .ok_or_else(|| {
                RepositoryError::InvalidToken(4002, "Claim 'uid' is not a valid id".to_string())
            })?;

        let token_type = claims
            .get("type")
            .ok_or_else(|| {
                RepositoryError::InvalidToken(4003, "Claim 'type' is missing".to_string())
            })?
            .as_str()
            .ok_or_else(|| {
                RepositoryError::InvalidToken(
                    4004,
                    "Claim 'type' is not a valid string".to_string(),
                )
            })?;

        if TokenType::from(token_type) != expected_token_type {
            return Err(RepositoryError::InvalidToken(
                4005,
                "Invalid token type".to_string(),
            ));
        }

        let mut additional_claims = claims
            .as_object()
            .ok_or_else(|| {
                RepositoryError::InvalidToken(
                    4006,
                    "Claims are not a valid JSON object".to_string(),
                )
            })?
            .clone();

        additional_claims.remove("uid");
        additional_claims.remove("type");
        additional_claims.remove("exp");

        let additional_data: T =
            serde_json::from_value(Value::Object(additional_claims)).map_err(|e| {
                RepositoryError::InvalidToken(4007, format!("Failed to deserialize claims: {}", e))
            })?;

        Ok((uid, additional_data))
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
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

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
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

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
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

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
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

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
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

        Ok(())
    }
}
