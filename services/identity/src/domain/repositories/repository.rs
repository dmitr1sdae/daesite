use crate::domain::error::RepositoryError;
use serde::{Deserialize, Serialize};

pub type RepositoryResult<T> = Result<T, RepositoryError>;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResultPaging<T> {
    pub code: i64,
    pub items: Vec<T>,
    pub next_page: Option<String>,
}

pub const DEFAULT_NEXT_PAGE: Option<String> = None;
pub const DEFAULT_PAGE_SIZE: Option<usize> = Some(25);

pub trait QueryParams: Send + Sync {
    fn next_page(&self) -> String;
    fn page_size(&self) -> usize;
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryParamsImpl {
    pub next_page: Option<String>,
    pub page_size: Option<usize>,
}

impl QueryParams for QueryParamsImpl {
    fn next_page(&self) -> String {
        self.next_page
            .clone()
            .or(DEFAULT_NEXT_PAGE)
            .unwrap_or_default()
    }
    fn page_size(&self) -> usize {
        self.page_size.or(DEFAULT_PAGE_SIZE).unwrap_or_default()
    }
}
