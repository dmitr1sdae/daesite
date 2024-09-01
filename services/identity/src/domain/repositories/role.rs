use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::domain::models::id::ID;
use crate::domain::models::role::{CreateRole, Role};

use super::repository::ResultPaging;
use super::repository::{QueryParams, RepositoryResult, DEFAULT_NEXT_PAGE, DEFAULT_PAGE_SIZE};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
pub struct RoleQueryParams {
    pub next_page: Option<ID>,
    #[validate(range(min = 5, max = 50))]
    pub page_size: Option<usize>,
    pub query: Option<String>,
}

impl QueryParams for RoleQueryParams {
    fn next_page(&self) -> ID {
        self.next_page.or(DEFAULT_NEXT_PAGE).unwrap_or_default()
    }
    fn page_size(&self) -> usize {
        self.page_size.or(DEFAULT_PAGE_SIZE).unwrap_or_default()
    }
}

#[async_trait::async_trait]
pub trait RoleRepository: Send + Sync {
    async fn create(&self, id: ID, new_role: &CreateRole) -> RepositoryResult<Role>;
    async fn list(&self, params: RoleQueryParams) -> RepositoryResult<ResultPaging<Role>>;
    async fn get(&self, role_id: ID) -> RepositoryResult<Role>;
    async fn delete(&self, role_id: ID) -> RepositoryResult<()>;
}
