use axum::extract::DefaultBodyLimit;
use axum::http::header::AUTHORIZATION;
use axum::Router;
use identity::api::grpc::identity::IdentityService;
use identity::api::proto::identity::identity_server::IdentityServer;
use std::iter::once;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::net::TcpListener;
use tower_http::compression::CompressionLayer;
use tower_http::cors::{CorsLayer, MaxAge};
use tower_http::sensitive_headers::SetSensitiveRequestHeadersLayer;
use tower_http::trace::TraceLayer;
use tracing::info;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::EnvFilter;

#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tokio::spawn(async move {
        info!(target: "identity::grpc", "Starting identity service");
        tonic::transport::Server::builder()
            .add_service(IdentityServer::new(IdentityService::default()))
            .serve("0.0.0.0:6001".parse().unwrap())
            .await
            .unwrap();
    });

    let server = Router::new()
        .layer(CorsLayer::very_permissive().max_age(MaxAge::exact(Duration::from_secs(3600))))
        .layer(
            CompressionLayer::new()
                .br(true)
                .deflate(true)
                .gzip(true)
                .zstd(true),
        )
        .layer(SetSensitiveRequestHeadersLayer::new(once(AUTHORIZATION)))
        .layer(TraceLayer::new_for_http())
        .layer(DefaultBodyLimit::max(5 * 1024 * 1024))
        .into_make_service_with_connect_info::<SocketAddr>();

    let listener = TcpListener::bind("0.0.0.0:6000").await?;
    info!(target: "identity::http", "Starting identity service");
    axum::serve(listener, server).await
}
