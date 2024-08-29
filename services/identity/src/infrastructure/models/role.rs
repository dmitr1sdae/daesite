use crate::domain::models::{id::ID, permission::Permission, role::Role};

use super::permission::PostgresPermission;

#[derive(Clone, Debug)]
pub struct PostgresRole {
    pub id: ID,
    pub name: String,
    pub permissions: Vec<PostgresPermission>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl From<PostgresRole> for Role {
    fn from(role: PostgresRole) -> Self {
        Role {
            id: role.id,
            name: role.name,
            permissions: role.permissions.into_iter().map(Permission::from).collect(),
            created_at: role.created_at,
            updated_at: role.updated_at,
        }
    }
}
