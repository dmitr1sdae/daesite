use crate::domain::models::id::ID;

#[derive(Clone, Debug)]
pub struct PostgresModulus {
    pub id: ID,
    pub modulus: String,
}
