use crate::domain::models::token_type::TokenType;
use std::fmt;
use std::str;
use std::str::FromStr;

impl fmt::Display for TokenType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl str::FromStr for TokenType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "MFA" => Ok(TokenType::MFA),
            "Verify" => Ok(TokenType::Verify),
            _ => Err(()),
        }
    }
}

impl From<&str> for TokenType {
    fn from(s: &str) -> Self {
        TokenType::from_str(s).unwrap()
    }
}
