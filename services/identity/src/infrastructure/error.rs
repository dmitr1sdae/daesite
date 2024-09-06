use crate::domain::error::RepositoryError;
use image::error::ImageError;
use s3::error::S3Error;
use sqlx::Error as SqlxError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum InfrastructureRepositoryError {
    #[error("SQL query execution error: {0}")]
    Query(#[from] SqlxError),

    #[error("Failed to access S3: {0}")]
    S3(#[from] S3Error),

    #[error("Failed to process image: {0}")]
    ImageProcessing(#[from] ImageError),

    #[error("Unexpected error occurred")]
    Unexpected,
}

impl InfrastructureRepositoryError {
    pub fn into_inner(self) -> RepositoryError {
        match self {
            InfrastructureRepositoryError::Query(error) => {
                RepositoryError::Database(error.to_string())
            }
            InfrastructureRepositoryError::S3(error) => RepositoryError::Storage(error.to_string()),
            InfrastructureRepositoryError::ImageProcessing(error) => {
                RepositoryError::ImageProcessing(error.to_string())
            }
            _ => RepositoryError::Unexpected,
        }
    }
}
