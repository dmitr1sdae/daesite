ARG TAG=latest

FROM daesite/base AS builder

RUN chmod +x  /app/applications/accounts/.next/standalone/applications/accounts/server.js

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /app

COPY --from=builder /app/applications/accounts/.next/standalone/applications/accounts/ ./
COPY --from=builder /app/applications/accounts/.next/standalone/node_modules node_modules
COPY --from=builder /app/applications/accounts/.next/static ./.next/static

EXPOSE 3000

CMD ["/app/server.js"]
