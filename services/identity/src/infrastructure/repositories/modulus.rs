use crate::domain::models::id::ID;
use crate::domain::models::modulus::{CreateModulus, Modulus};
use crate::domain::repositories::modulus::{ModulusQueryParams, ModulusRepository};
use crate::domain::repositories::repository::{QueryParams, RepositoryResult, ResultPaging};
use crate::infrastructure::connectors::postgres;
use crate::infrastructure::error::InfrastructureRepositoryError;
use std::collections::HashMap;
use std::sync::Arc;

pub struct ModulusPostgresRepository {
    repository: Arc<postgres::Session>,
}

impl ModulusPostgresRepository {
    pub fn new(repository: Arc<postgres::Session>) -> Self {
        Self { repository }
    }
}

#[async_trait::async_trait]
impl ModulusRepository for ModulusPostgresRepository {
    async fn create(&self, id: ID, new_modulus: &CreateModulus) -> RepositoryResult<Modulus> {
        let result = sqlx::query_as!(
            Modulus,
            r#"
            INSERT INTO modulus (id, modulus)
            VALUES ($1, $2)
            RETURNING id, modulus
            "#,
            id,
            new_modulus.modulus
        )
        .fetch_one(self.repository.as_ref())
        .await
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

        Ok(result)
    }

    async fn list(&self, params: ModulusQueryParams) -> RepositoryResult<ResultPaging<Modulus>> {
        let limit = params.page_size() as i64;
        let next_page = params.next_page();

        let rows = sqlx::query!(
            "
            SELECT id, modulus
            FROM modulus
            WHERE ($1::bigint IS NULL OR id < $1)
            ORDER BY id DESC
            LIMIT $2
            ",
            next_page,
            limit
        )
        .fetch_all(self.repository.as_ref())
        .await
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

        let next_cursor = rows.last().map(|row| row.id);

        let mut modules_map: HashMap<ID, Modulus> = HashMap::new();

        for row in rows {
            let modulus_id = row.id;
            modules_map.entry(modulus_id).or_insert_with(|| Modulus {
                id: modulus_id,
                modulus: row.modulus,
            });
        }

        let modules: Vec<Modulus> = modules_map.into_values().collect();

        let result_paging = ResultPaging {
            code: 0,
            items: modules,
            next_page: next_cursor.map(|id| id.to_string()),
        };

        Ok(result_paging)
    }

    async fn get(&self, modulus_id: ID) -> RepositoryResult<Modulus> {
        let result = sqlx::query_as!(
            Modulus,
            r#"
            SELECT id, modulus
            FROM modulus
            WHERE id = $1
            "#,
            modulus_id
        )
        .fetch_one(self.repository.as_ref())
        .await
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

        Ok(result)
    }

    async fn delete(&self, modulus_id: ID) -> RepositoryResult<()> {
        sqlx::query!(
            r#"
            DELETE FROM modulus
            WHERE id = $1
            "#,
            modulus_id
        )
        .execute(self.repository.as_ref())
        .await
        .map_err(|e| InfrastructureRepositoryError::Query(e).into_inner())?;

        Ok(())
    }
}
