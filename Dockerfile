# syntax=docker/dockerfile:1

ARG DENO_VERSION=latest

FROM denoland/deno:${DENO_VERSION:?} AS deno-base
SHELL ["bash", "-euo", "pipefail", "-c"]
WORKDIR /build


# https://docs.docker.com/build/bake/contexts/#deduplicate-context-transfer
FROM scratch AS ctx
COPY --link . .


FROM deno-base AS deno-deps-cache
COPY --from=ctx deno.json deno.lock dev_deps.ts ./
RUN deno cache *.ts


FROM deno-deps-cache AS task
ARG TASK_NAME
RUN --mount=from=ctx,source=.,target=.,rw \
    --mount=type=cache,from=deno-deps-cache,source=/deno-dir/,target=/deno-dir/ \
    deno task "${TASK_NAME:?}"
