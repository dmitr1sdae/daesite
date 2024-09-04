use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::domain::models::id::ID;
use crate::domain::models::user::{CheckUser, CreateUser, UpdateUser, User};
use crate::domain::repositories::repository::ResultPaging;

use super::role::RoleDTO;

#[derive(Debug, Serialize)]
pub struct UserDTO {
    pub id: ID,
    pub username: String,
    pub avatar: Option<ID>,
    pub email: String,
    pub roles: Vec<RoleDTO>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl From<User> for UserDTO {
    fn from(user: User) -> Self {
        UserDTO {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            roles: user.roles.into_iter().map(RoleDTO::from).collect(),
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}

impl From<ResultPaging<User>> for ResultPaging<UserDTO> {
    fn from(user: ResultPaging<User>) -> Self {
        ResultPaging {
            items: user.items.into_iter().map(UserDTO::from).collect(),
            code: user.code,
            next_page: user.next_page,
        }
    }
}

#[derive(Serialize, Deserialize, Validate)]
pub struct CheckUserDTO {
    pub username: String,
    pub email: String,
}

impl From<CheckUser> for CheckUserDTO {
    fn from(user: CheckUser) -> Self {
        CheckUserDTO {
            username: user.username,
            email: user.email,
        }
    }
}

#[derive(Serialize, Deserialize, Validate)]
pub struct CreateUserDTO {
    pub username: String,
    pub email: String,
    pub modulus: ID,
}

impl From<CreateUser> for CreateUserDTO {
    fn from(user: CreateUser) -> Self {
        CreateUserDTO {
            username: user.username,
            email: user.email,
            modulus: user.modulus,
        }
    }
}

#[derive(Serialize, Deserialize, Validate)]
pub struct UpdateUserDTO {
    pub username: Option<String>,
    pub avatar: Option<String>,
    pub email: Option<String>,
    pub roles: Vec<RoleDTO>,
}

impl From<UpdateUser> for UpdateUserDTO {
    fn from(user: UpdateUser) -> Self {
        UpdateUserDTO {
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            roles: user.roles.into_iter().map(RoleDTO::from).collect(),
        }
    }
}
