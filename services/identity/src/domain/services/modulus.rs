use crate::domain::error::CommonError;
use crate::domain::models::id::ID;
use crate::domain::models::modulus::{CreateModulus, Modulus};
use crate::domain::repositories::modulus::ModulusQueryParams;
use crate::domain::repositories::repository::ResultPaging;

#[async_trait::async_trait]
pub trait ModulusService: Sync + Send {
    async fn create(&self, modulus: CreateModulus) -> Result<Modulus, CommonError>;
    async fn list(&self, params: ModulusQueryParams) -> Result<ResultPaging<Modulus>, CommonError>;
    async fn get(&self, modulus_id: ID) -> Result<Modulus, CommonError>;
    async fn delete(&self, modulus_id: ID) -> Result<(), CommonError>;
}
