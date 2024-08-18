use super::storage::StorageResult;
use crate::domain::models::id::ID;

#[async_trait::async_trait]
pub trait UserStorage: Send + Sync {
    async fn create(&self, avatar_data: Vec<u8>) -> StorageResult<ID>;
    async fn delete(&self, avatar_id: ID) -> StorageResult<()>;
}
