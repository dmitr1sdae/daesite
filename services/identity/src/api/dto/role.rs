use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::api::dto::permission::PermissionDTO;
use crate::domain::models::id::ID;
use crate::domain::models::role::{CreateRole, Role};
use crate::domain::repositories::repository::ResultPaging;

#[derive(Debug, Serialize, Deserialize)]
pub struct RoleDTO {
    pub id: ID,
    pub name: String,
    pub permissions: Vec<PermissionDTO>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl From<Role> for RoleDTO {
    fn from(role: Role) -> Self {
        RoleDTO {
            id: role.id,
            name: role.name,
            permissions: role
                .permissions
                .into_iter()
                .map(|permission| PermissionDTO::from(permission))
                .collect(),
            created_at: role.created_at,
            updated_at: role.updated_at,
        }
    }
}

impl From<ResultPaging<Role>> for ResultPaging<RoleDTO> {
    fn from(modules: ResultPaging<Role>) -> Self {
        ResultPaging {
            items: modules
                .items
                .into_iter()
                .map(|role: Role| RoleDTO::from(role))
                .collect(),
            code: modules.code,
            next_page: modules.next_page,
        }
    }
}

#[derive(Serialize, Deserialize, Validate)]
pub struct CreateRoleDTO {
    #[validate(required, length(min = 1))]
    pub name: Option<String>,
    #[validate(length(min = 1))]
    pub permissions: Vec<PermissionDTO>,
}

impl From<CreateRole> for CreateRoleDTO {
    fn from(role: CreateRole) -> Self {
        CreateRoleDTO {
            name: Some(role.name),
            permissions: role
                .permissions
                .into_iter()
                .map(|permission| PermissionDTO::from(permission))
                .collect(),
        }
    }
}
