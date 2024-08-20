use sqlx::migrate::MigrateDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Connection, PgConnection, PgPool, Postgres};
use std::env;
use std::time::Duration;
use tracing::{error, info};

use crate::infrastructure::error::PostgresRepositoryError;

pub type Session = PgPool;

pub async fn connect() -> Session {
    let url = env::var("DATABASE_URL")
        .map_err(|_| "DATABASE_URL must be set")
        .unwrap();

    let min_connections = env::var("DATABASE_MIN_CONNECTIONS")
        .map_err(|_| "DATABASE_MIN_CONNECTIONS must be set")
        .unwrap()
        .parse()
        .map_err(|_| "DATABASE_MIN_CONNECTIONS must be a number")
        .unwrap();

    let max_connections = env::var("DATABASE_MAX_CONNECTIONS")
        .map_err(|_| "DATABASE_MAX_CONNECTIONS must be set")
        .unwrap()
        .parse()
        .map_err(|_| "DATABASE_MAX_CONNECTIONS must be a number")
        .unwrap();

    PgPoolOptions::new()
        .min_connections(min_connections)
        .max_connections(max_connections)
        .max_lifetime(Some(Duration::from_secs(60 * 60)))
        .connect(&url)
        .await
        .map_err(|err| error!("Error connecting to Scylla: {}", err))
        .unwrap()
}

pub async fn migrate() -> Result<(), PostgresRepositoryError> {
    let url = env::var("DATABASE_URL")
        .map_err(|_| "DATABASE_URL must be set")
        .unwrap();

    let url = url.as_str();
    if !Postgres::database_exists(url).await? {
        info!("Creating database...");
        Postgres::create_database(url).await?;
    }

    info!("Applying migrations...");

    let mut conn = PgConnection::connect(url).await?;
    sqlx::migrate!()
        .run(&mut conn)
        .await
        .expect("Error while running database migrations!");

    Ok(())
}
