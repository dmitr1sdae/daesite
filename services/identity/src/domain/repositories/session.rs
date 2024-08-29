use super::repository::RepositoryResult;
use crate::domain::models::id::ID;
use crate::domain::models::session::Session;

#[async_trait::async_trait]
pub trait SessionRepository: Send + Sync {
    async fn create(&self, user_id: ID) -> RepositoryResult<Session>;
    async fn list(&self, user_id: ID) -> RepositoryResult<Vec<Session>>;
    async fn get(&self, session_id: ID) -> RepositoryResult<Session>;
    async fn delete(&self, session_id: ID) -> RepositoryResult<()>;
    async fn delete_all(&self, user_id: ID) -> RepositoryResult<()>;
}
