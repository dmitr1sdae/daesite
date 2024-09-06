use super::repository::RepositoryResult;
use crate::domain::models::avatar::Avatar;

#[async_trait::async_trait]
pub trait AvatarRepository: Sync + Send {
    async fn upload_avatar(&self, avatar: Avatar) -> RepositoryResult<Avatar>;
}
