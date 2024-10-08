ARG TAG=latest

FROM daesite/packages:${TAG} AS builder

WORKDIR /app/services/identity

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive \
  && apt-get install --no-install-recommends --assume-yes \
  protobuf-compiler libprotobuf-dev build-essential pkg-config \
  libssl-dev

COPY . .
ARG SQLX_OFFLINE=true

RUN RUSTFLAGS="-C target-feature=+crt-static" cargo build --target x86_64-unknown-linux-gnu --release

FROM gcr.io/distroless/static-debian11
WORKDIR /app

EXPOSE 8080 8081

COPY --from=builder --chown=nonroot:nonroot /app/services/identity/target/x86_64-unknown-linux-gnu/release/identity /app
COPY --from=builder  /app/services/identity/migrations/* /app/migrations

ENTRYPOINT ["/app/identity"]
