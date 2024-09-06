use super::repository::ResultPaging;
use super::repository::{QueryParams, RepositoryResult, DEFAULT_NEXT_PAGE, DEFAULT_PAGE_SIZE};
use crate::domain::models::id::ID;
use crate::domain::models::modulus::CreateModulus;
use crate::domain::models::modulus::Modulus;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
pub struct ModulusQueryParams {
    pub next_page: Option<ID>,
    #[validate(range(min = 5, max = 50))]
    pub page_size: Option<usize>,
}

impl QueryParams for ModulusQueryParams {
    fn next_page(&self) -> ID {
        self.next_page.or(DEFAULT_NEXT_PAGE).unwrap_or_default()
    }
    fn page_size(&self) -> usize {
        self.page_size.or(DEFAULT_PAGE_SIZE).unwrap_or_default()
    }
}

#[async_trait::async_trait]
pub trait ModulusRepository: Send + Sync {
    async fn create(&self, id: ID, new_modulus: &CreateModulus) -> RepositoryResult<Modulus>;
    async fn list(&self, params: ModulusQueryParams) -> RepositoryResult<ResultPaging<Modulus>>;
    async fn get(&self, modulus_id: ID) -> RepositoryResult<Modulus>;
    async fn delete(&self, modulus_id: ID) -> RepositoryResult<()>;
}
