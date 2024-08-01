use serde::{Deserialize, Serialize};

use crate::domain::models::id::ID;
use crate::domain::models::permission::Permission;

#[derive(Debug, Serialize, Deserialize)]
pub struct PermissionDTO {
    pub id: ID,
    pub name: String,
}

impl From<Permission> for PermissionDTO {
    fn from(permission: Permission) -> Self {
        PermissionDTO {
            id: permission.id,
            name: permission.name,
        }
    }
}
