use serde::Serialize;

use crate::domain::models::id::ID;
use crate::domain::models::role::Role;

#[derive(Debug, Serialize)]
pub struct User {
    pub id: ID,
    pub username: String,
    pub avatar: Option<ID>,
    pub modulus: ID,
    pub email: String,
    pub roles: Vec<Role>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Clone)]
pub struct CheckUser {
    pub username: String,
    pub email: String,
}

#[derive(Clone)]
pub struct CreateUser {
    pub username: String,
    pub email: String,
    pub modulus: ID,
}

impl From<CreateUser> for CheckUser {
    fn from(user: CreateUser) -> Self {
        CheckUser {
            username: user.username,
            email: user.email,
        }
    }
}

pub struct UpdateUser {
    pub username: Option<String>,
    pub avatar: Option<String>,
    pub email: Option<String>,
    pub roles: Vec<Role>,
}
