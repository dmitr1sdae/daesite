use crate::domain::models::id::ID;
use crate::domain::models::modulus::Modulus;

#[derive(Clone, Debug)]
pub struct PostgresModulus {
    pub id: ID,
    pub modulus: String,
}

impl From<PostgresModulus> for Modulus {
    fn from(modulus: PostgresModulus) -> Self {
        Modulus {
            id: modulus.id,
            modulus: modulus.modulus,
        }
    }
}
