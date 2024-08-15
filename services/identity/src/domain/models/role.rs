use serde::Serialize;

use crate::domain::models::id::ID;
use crate::domain::models::permission::Permission;

#[derive(Debug, Serialize)]
pub struct Role {
    pub id: ID,
    pub name: String,
    pub permissions: Vec<Permission>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Clone)]
pub struct CreateRole {
    pub name: String,
    pub permissions: Vec<Permission>,
}
