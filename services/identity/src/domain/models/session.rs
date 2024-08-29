use super::id::ID;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Session {
    pub id: ID,
    pub user_id: ID,
    pub access_token: String,
    pub refresh_token: String,
    pub created_at: i64,
    pub updated_at: i64,
}
