use serde::Serialize;
use super::id::ID;

#[derive(Debug, Serialize)]
pub struct Token {
    pub id: ID,
    pub token: String,
    pub created_at: i64,
    pub updated_at: i64,
}
