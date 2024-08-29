use crate::domain::error::CommonError;
use crate::domain::models::id::ID;
use crate::domain::models::session::Session;

#[async_trait::async_trait]
pub trait SessionService: Sync + Send {
    async fn get_token_pair(&self, user_id: ID) -> Result<Session, CommonError>;
    async fn revoke_token_pair(&self, session_id: ID) -> Result<(), CommonError>;
}
