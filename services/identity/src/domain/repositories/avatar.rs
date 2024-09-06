use super::repository::RepositoryResult;
use crate::domain::models::avatar::Avatar;
use crate::domain::models::id::ID;

#[async_trait::async_trait]
pub trait AvatarRepository: Sync + Send {
    async fn upload_avatar(&self, avatar: Avatar) -> RepositoryResult<Avatar>;
    async fn delete_avatar(&self, user_id: ID, avatar_id: ID) -> RepositoryResult<()>;
    async fn delete_all(&self, user_id: ID) -> RepositoryResult<()>;
}
