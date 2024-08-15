use crate::domain::error::CommonError;
use crate::domain::models::id::ID;
use crate::domain::models::role::{CreateRole, Role};
use crate::domain::repositories::repository::ResultPaging;
use crate::domain::repositories::role::RoleQueryParams;

#[async_trait::async_trait]
pub trait RoleService: Sync + Send {
    async fn create(&self, role: CreateRole) -> Result<Role, CommonError>;
    async fn list(&self, params: RoleQueryParams) -> Result<ResultPaging<Role>, CommonError>;
    async fn get(&self, role_id: ID) -> Result<Role, CommonError>;
    async fn delete(&self, role_id: ID) -> Result<(), CommonError>;
}
