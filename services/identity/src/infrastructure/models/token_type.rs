use crate::domain::models::token_type::TokenType;

impl ToString for TokenType {
    fn to_string(&self) -> String {
        match self {
            TokenType::MFA => "mfa".to_string(),
            TokenType::Verify => "verify".to_string(),
            _ => "unknown".to_string(),
        }
    }
}

impl From<&str> for TokenType {
    fn from(s: &str) -> Self {
        match s {
            "mfa" => TokenType::MFA,
            "verify" => TokenType::Verify,
            _ => TokenType::Unknown,
        }
    }
}
