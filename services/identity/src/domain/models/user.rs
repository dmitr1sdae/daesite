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
    pub salt: String,
    pub verifier: String,
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
    pub salt: String,
    pub verifier: String,
}

pub struct UpdateUser {
    pub username: Option<String>,
    pub avatar: Option<String>,
    pub email: Option<String>,
    pub roles: Vec<Role>,
}
