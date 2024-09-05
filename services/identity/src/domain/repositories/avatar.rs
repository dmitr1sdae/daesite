use super::repository::RepositoryResult;
use crate::domain::models::avatar::Avatar;
use crate::domain::models::id::ID;

#[async_trait::async_trait]
pub trait AvatarRepository: Sync + Send {
    async fn upload_avatar(&self, user_id: ID, avatar: Avatar) -> RepositoryResult<Avatar>;
}
