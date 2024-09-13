use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Serialize, Clone)]
pub struct CommonError {
    pub message: String,
    pub description: String,
    pub code: u32,
}

impl std::fmt::Display for CommonError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Error: {}, Code: {}", self.message, self.code)
    }
}

#[derive(Debug)]
pub struct ApiError(CommonError);

impl ApiError {
    pub fn status_code(&self) -> StatusCode {
        match self.0.code {
            // ### 1XX: common codes ###
            // 102: common server error
            102 => StatusCode::INTERNAL_SERVER_ERROR,
            // 104: object not exists
            104 => StatusCode::NOT_FOUND,

            // ### 2XX:  ###
            // 203: CAPTCHA needed
            203 => StatusCode::UNAUTHORIZED,

            // ### 5XX: internal errors codes ###
            // 500: Request failed
            500 => StatusCode::INTERNAL_SERVER_ERROR,
            // 501: Parsing response failed
            501 => StatusCode::INTERNAL_SERVER_ERROR,

            _ => StatusCode::BAD_REQUEST,
        }
    }
}

impl From<CommonError> for ApiError {
    fn from(error: CommonError) -> ApiError {
        ApiError(error)
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let clone = self.0.clone();

        let error = CommonError {
            description: clone.description,
            message: clone.message,
            code: clone.code,
        };

        (self.status_code(), Json(error)).into_response()
    }
}

#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("Database error: {0}")]
    Database(String),

    #[error("Failed error to access storage: {0}")]
    Storage(String),

    #[error("Failed to process image: {0}")]
    ImageProcessing(String),

    #[error("Invalid token: {1}")]
    InvalidToken(u32, String),

    #[error("Token has expired")]
    TokenExpired,

    #[error("Unexpected error occurred")]
    Unexpected,
}

impl From<RepositoryError> for CommonError {
    fn from(error: RepositoryError) -> Self {
        match error {
            RepositoryError::Database(details) => CommonError {
                message: "Database error".to_string(),
                description: details,
                code: 2001,
            },
            RepositoryError::Storage(details) => CommonError {
                message: "Storage error".to_string(),
                description: details,
                code: 2000,
            },
            RepositoryError::ImageProcessing(details) => CommonError {
                message: "Image processing error".to_string(),
                description: details,
                code: 2007,
            },
            RepositoryError::InvalidToken(code, details) => CommonError {
                message: "Token error".to_string(),
                description: details,
                code,
            },
            _ => CommonError {
                message: "Unexpected error".to_string(),
                description: "An unexpected error occurred".to_string(),
                code: 3000,
            },
        }
    }
}
