use axum::extract::rejection::{JsonRejection, PathRejection, QueryRejection};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;

use crate::domain::error::CommonError;

#[derive(thiserror::Error, Debug)]
pub enum HttpError {
    #[error("Deserialization error: {0}")]
    Json(#[from] JsonRejection),
    #[error("Query parsing error: {0}")]
    Query(#[from] QueryRejection),
    #[error("Path parsing error: {0}")]
    Path(#[from] PathRejection),
}

impl IntoResponse for HttpError {
    fn into_response(self) -> Response {
        let error = CommonError {
            description: self.to_string(),
            message: self.error_message(),
            code: self.error_code(),
        };

        (self.status_code(), Json(error)).into_response()
    }
}

impl HttpError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            HttpError::Json(_) => StatusCode::BAD_REQUEST,
            HttpError::Query(_) => StatusCode::BAD_REQUEST,
            HttpError::Path(_) => StatusCode::BAD_REQUEST,
        }
    }

    pub fn error_message(&self) -> String {
        match self {
            HttpError::Json(rejection) => match rejection {
                JsonRejection::JsonDataError(_) => {
                    "The request body contains invalid data".to_string()
                }
                JsonRejection::JsonSyntaxError(_) => {
                    "The request body contains invalid JSON".to_string()
                }
                JsonRejection::MissingJsonContentType(_) => {
                    "The request is missing JSON content type".to_string()
                }
                JsonRejection::BytesRejection(_) => {
                    "The request body contains invalid bytes".to_string()
                }
                _ => "".to_string(),
            },
            HttpError::Query(_) => "The request query parameters are invalid".to_string(),
            HttpError::Path(_) => "The request path are invalid".to_string(),
        }
    }

    pub fn error_code(&self) -> u32 {
        match self {
            HttpError::Json(_) => 50109,
            HttpError::Query(_) => 50110,
            HttpError::Path(_) => 50111,
        }
    }
}

pub async fn not_found() -> (StatusCode, Json<CommonError>) {
    (
        StatusCode::NOT_FOUND,
        Json(CommonError {
            message: "404: Not Found".to_string(),
            description: "The requested route does not exist".to_string(),
            code: 0,
        }),
    )
}
