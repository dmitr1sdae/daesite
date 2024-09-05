use crate::domain::error::{RepositoryError, StorageError};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum PostgresRepositoryError {
    #[error("Database error: {0}")]
    DatabaseError(String),

    #[error(transparent)]
    SqlxError(#[from] sqlx::Error),

    #[error(transparent)]
    PasetoError(#[from] rusty_paseto::prelude::GenericBuilderError),

    #[error(transparent)]
    ImageError(#[from] image::ImageError),

    #[error(transparent)]
    Other(#[from] RepositoryError),
}

impl PostgresRepositoryError {
    pub fn new(description: &str) -> PostgresRepositoryError {
        PostgresRepositoryError::DatabaseError(description.to_string())
    }

    pub fn into_inner(self) -> RepositoryError {
        match self {
            PostgresRepositoryError::DatabaseError(description) => {
                RepositoryError::DatabaseError(description)
            }
            PostgresRepositoryError::SqlxError(error) => {
                RepositoryError::DatabaseError(error.to_string())
            }
            PostgresRepositoryError::PasetoError(error) => {
                RepositoryError::DatabaseError(error.to_string())
            }
            PostgresRepositoryError::ImageError(error) => {
                RepositoryError::ImageError(error.to_string())
            }
            PostgresRepositoryError::Other(error) => error,
        }
    }
}

#[derive(Debug, Error)]
pub enum S3StorageError {
    #[error("{message}: {description} (code: {code})")]
    CustomError {
        message: String,
        description: String,
        code: u32,
    },

    #[error("Storage error: {0}")]
    StorageError(String),

    #[error(transparent)]
    S3Error(#[from] s3::error::S3Error),

    #[error(transparent)]
    ParseError(#[from] std::num::ParseIntError),

    #[error(transparent)]
    Other(#[from] StorageError),
}

impl S3StorageError {
    pub fn new(message: &str, description: &str, code: u32) -> Self {
        S3StorageError::CustomError {
            message: message.to_string(),
            description: description.to_string(),
            code,
        }
    }

    pub fn into_inner(self) -> StorageError {
        match self {
            S3StorageError::CustomError {
                message,
                description,
                code,
            } => StorageError {
                message,
                description,
                code,
            },
            S3StorageError::StorageError(message) => StorageError {
                message,
                description: "Storage error".to_string(),
                code: 1,
            },
            S3StorageError::S3Error(error) => StorageError {
                message: error.to_string(),
                description: "S3 Error".to_string(),
                code: 2,
            },
            S3StorageError::ParseError(error) => StorageError {
                message: error.to_string(),
                description: "Parse Error".to_string(),
                code: 3,
            },
            S3StorageError::Other(error) => error,
        }
    }
}
