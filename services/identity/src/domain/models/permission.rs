use serde::Serialize;

use crate::domain::models::id::ID;

#[derive(Debug, Serialize, Clone)]
pub struct Permission {
    pub id: ID,
    pub name: String,
}
