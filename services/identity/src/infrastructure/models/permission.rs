use crate::domain::models::{id::ID, permission::Permission};

#[derive(Debug, Clone)]
pub struct PostgresPermission {
    pub id: ID,
    pub name: String,
}

impl From<PostgresPermission> for Permission {
    fn from(perm: PostgresPermission) -> Self {
        Permission {
            id: perm.id,
            name: perm.name,
        }
    }
}
