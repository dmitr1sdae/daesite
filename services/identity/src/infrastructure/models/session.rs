use crate::domain::models::id::ID;
use crate::domain::models::session::Session;

#[derive(Clone, Debug)]
pub struct PostgresSession {
    pub id: ID,
    pub user_id: ID,
    pub access_token: String,
    pub refresh_token: String,
    pub created_at: i64,
    pub updated_at: i64,
}

impl From<PostgresSession> for Session {
    fn from(session: PostgresSession) -> Self {
        Session {
            id: session.id,
            user_id: session.user_id,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            created_at: session.created_at,
            updated_at: session.updated_at,
        }
    }
}
