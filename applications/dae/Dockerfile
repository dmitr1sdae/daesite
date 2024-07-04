ARG TAG=latest

FROM daesite/base AS builder

RUN chmod +x  /app/applications/dae/.next/standalone/applications/dae/server.js

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /app

COPY --from=builder /app/applications/dae/.next/standalone/applications/dae/ ./
COPY --from=builder /app/applications/dae/.next/standalone/node_modules node_modules
COPY --from=builder /app/applications/dae/.next/static ./.next/static

EXPOSE 3000

CMD ["/app/server.js"]
