use crate::domain::models::id::ID;
use crate::domain::models::session::Session;

#[derive(Clone, Debug)]
pub struct PostgresSession {
    pub id: ID,
    pub user_id: ID,
    pub access_token: String,
    pub refresh_token: String,
    pub created_at: i64,
    pub expires_at: i64,
    pub ip_address: String,
    pub user_agent: String,
}

impl From<PostgresSession> for Session {
    fn from(session: PostgresSession) -> Self {
        Session {
            id: session.id,
            user_id: session.user_id,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            created_at: session.created_at,
            expires_at: session.expires_at,
            ip_address: session.ip_address,
            user_agent: session.user_agent,
        }
    }
}
