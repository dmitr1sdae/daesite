use crate::domain::error::StorageError;

pub type StorageResult<T> = Result<T, StorageError>;
