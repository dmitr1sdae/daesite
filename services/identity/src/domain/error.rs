use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

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
            102 => StatusCode::INTERNAL_SERVER_ERROR,
            104 => StatusCode::NOT_FOUND,
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

#[derive(Debug)]
pub struct RepositoryError {
    pub message: String,
    pub description: String,
    pub code: u32,
}

impl From<RepositoryError> for CommonError {
    fn from(error: RepositoryError) -> Self {
        CommonError {
            message: error.message,
            description: error.description,
            code: error.code,
        }
    }
}

impl std::fmt::Display for RepositoryError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

#[derive(Debug)]
pub struct StorageError {
    pub message: String,
    pub description: String,
    pub code: u32,
}

impl From<StorageError> for CommonError {
    fn from(error: StorageError) -> Self {
        CommonError {
            message: error.message,
            description: error.description,
            code: error.code,
        }
    }
}

impl std::fmt::Display for StorageError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}
