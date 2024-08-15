use serde::Serialize;

use crate::domain::models::id::ID;

#[derive(Debug, Serialize)]
pub struct Modulus {
    pub id: ID,
    pub modulus: String,
}

#[derive(Clone)]
pub struct CreateModulus {
    pub modulus: String,
}
