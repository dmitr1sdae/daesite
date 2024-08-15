use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::domain::models::id::ID;
use crate::domain::models::modulus::{CreateModulus, Modulus};
use crate::domain::repositories::repository::ResultPaging;

#[derive(Debug, Serialize)]
pub struct ModulusDTO {
    pub id: ID,
    pub modulus: String,
}

impl From<Modulus> for ModulusDTO {
    fn from(modulus: Modulus) -> Self {
        ModulusDTO {
            id: modulus.id,
            modulus: modulus.modulus,
        }
    }
}

impl From<ResultPaging<Modulus>> for ResultPaging<ModulusDTO> {
    fn from(modules: ResultPaging<Modulus>) -> Self {
        ResultPaging {
            items: modules
                .items
                .into_iter()
                .map(|modulus: Modulus| ModulusDTO::from(modulus))
                .collect(),
            code: modules.code,
            next_page: modules.next_page,
        }
    }
}

#[derive(Serialize, Deserialize, Validate)]
pub struct CreateModulusDTO {
    #[validate(required, length(min = 1))]
    pub modulus: Option<String>,
}

impl From<CreateModulus> for CreateModulusDTO {
    fn from(modulus: CreateModulus) -> Self {
        CreateModulusDTO {
            modulus: Some(modulus.modulus),
        }
    }
}
