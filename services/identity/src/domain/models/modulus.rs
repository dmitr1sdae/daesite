use crate::domain::models::id::ID;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Modulus {
    pub id: ID,
    pub modulus: String,
}

#[derive(Clone)]
pub struct CreateModulus {
    pub modulus: String,
}
