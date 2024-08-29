use super::role::PostgresRole;
use crate::domain::models::id::ID;
use crate::domain::models::role::Role;
use crate::domain::models::user::User;

#[derive(Clone, Debug)]
pub struct PostgresUser {
    pub id: ID,
    pub username: String,
    pub avatar: Option<ID>,
    pub modulus: ID,
    pub email: String,
    pub roles: Vec<PostgresRole>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl From<PostgresUser> for User {
    fn from(user: PostgresUser) -> Self {
        User {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            modulus: user.modulus,
            email: user.email,
            roles: user.roles.into_iter().map(Role::from).collect(),
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}
