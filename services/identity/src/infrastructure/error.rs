use crate::domain::error::{RepositoryError, StorageError};

pub struct PostgresRepositoryError(RepositoryError);

impl PostgresRepositoryError {
    pub fn new(message: &str, description: &str, code: u32) -> PostgresRepositoryError {
        PostgresRepositoryError(RepositoryError {
            message: message.to_string(),
            description: description.to_string(),
            code,
        })
    }

    pub fn into_inner(self) -> RepositoryError {
        self.0
    }
}

impl From<&str> for PostgresRepositoryError {
    fn from(error: &str) -> Self {
        PostgresRepositoryError(RepositoryError {
            message: error.to_string(),
            description: "Database error".to_string(),
            code: 1,
        })
    }
}

impl From<sqlx::Error> for PostgresRepositoryError {
    fn from(error: sqlx::Error) -> Self {
        PostgresRepositoryError(RepositoryError {
            message: error.to_string(),
            description: "Database error".to_string(),
            code: 1,
        })
    }
}

#[derive(Debug)]
pub struct S3StorageError(StorageError);

impl S3StorageError {
    pub fn new(message: &str, description: &str, code: u32) -> S3StorageError {
        S3StorageError(StorageError {
            message: message.to_string(),
            description: description.to_string(),
            code,
        })
    }

    pub fn into_inner(self) -> StorageError {
        self.0
    }
}

impl From<&str> for S3StorageError {
    fn from(error: &str) -> Self {
        S3StorageError(StorageError {
            message: error.to_string(),
            description: "Storage error".to_string(),
            code: 1,
        })
    }
}

impl From<s3::error::S3Error> for S3StorageError {
    fn from(error: s3::error::S3Error) -> Self {
        S3StorageError(StorageError {
            message: error.to_string(),
            description: "Storage error".to_string(),
            code: 1,
        })
    }
}

impl From<std::num::ParseIntError> for S3StorageError {
    fn from(error: std::num::ParseIntError) -> Self {
        S3StorageError(StorageError {
            message: error.to_string(),
            description: "Storage error".to_string(),
            code: 1,
        })
    }
}

pub struct DecodeError(RepositoryError);

impl DecodeError {
    pub fn into_inner(self) -> RepositoryError {
        self.0
    }
}

impl From<base64_url::base64::DecodeError> for DecodeError {
    fn from(error: base64_url::base64::DecodeError) -> Self {
        DecodeError(RepositoryError {
            message: error.to_string(),
            description: "base64 parsing error".to_string(),
            code: 1,
        })
    }
}
