use crate::domain::error::CommonError;
use crate::domain::models::id::ID;
use crate::domain::models::user::{CreateUser, UpdateUser, User};
use crate::domain::repositories::repository::ResultPaging;
use crate::domain::repositories::user::UserQueryParams;

#[async_trait::async_trait]
pub trait UserService: Sync + Send {
    async fn create(&self, user: CreateUser) -> Result<User, CommonError>;
    async fn list(&self, params: UserQueryParams) -> Result<ResultPaging<User>, CommonError>;
    async fn get(&self, user_id: ID) -> Result<User, CommonError>;
    async fn update(&self, user_id: ID, user: UpdateUser) -> Result<User, CommonError>;
    async fn delete(&self, user_id: ID) -> Result<(), CommonError>;
}
