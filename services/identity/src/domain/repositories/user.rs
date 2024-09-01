use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::domain::models::id::ID;
use crate::domain::models::user::{CheckUser, CreateUser, UpdateUser, User};

use super::repository::ResultPaging;
use super::repository::{QueryParams, RepositoryResult, DEFAULT_NEXT_PAGE, DEFAULT_PAGE_SIZE};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
pub struct UserQueryParams {
    pub next_page: Option<ID>,
    #[validate(range(min = 5, max = 50))]
    pub page_size: Option<usize>,
}

impl QueryParams for UserQueryParams {
    fn next_page(&self) -> ID {
        self.next_page.or(DEFAULT_NEXT_PAGE).unwrap_or_default()
    }
    fn page_size(&self) -> usize {
        self.page_size.or(DEFAULT_PAGE_SIZE).unwrap_or_default()
    }
}

#[async_trait::async_trait]
pub trait UserRepository: Send + Sync {
    async fn check(&self, user: &CheckUser) -> RepositoryResult<bool>;
    async fn create(&self, new_user: &CreateUser) -> RepositoryResult<User>;
    async fn list(&self, params: UserQueryParams) -> RepositoryResult<ResultPaging<User>>;
    async fn get_by_id(&self, user_id: ID) -> RepositoryResult<User>;
    async fn get_by_email(&self, user_email: String) -> RepositoryResult<User>;
    async fn get_by_username(&self, username: String) -> RepositoryResult<User>;
    async fn update(&self, user_id: ID, user: &UpdateUser) -> RepositoryResult<User>;
    async fn delete(&self, user_id: ID) -> RepositoryResult<()>;
}
