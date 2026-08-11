set dotenv-load
set dotenv-required
set dotenv-filename := '.env'

alias df := dev-fresh
alias pf := prod-fresh

dev:
    docker compose -f docker-compose.dev.yaml up -d
    ./dev.sh

dev-fresh:
    docker compose -f docker-compose.dev.yaml build --no-cache
    just dev

dev-stop:
    docker compose -f docker-compose.dev.yaml down

prod:
    pnpm --filter tiptap build
    docker compose -f docker-compose.prod.yaml up -d
    open http://localhost

prod-fresh:
    docker compose -f docker-compose.prod.yaml build --no-cache
    just prod

prod-stop:
    docker compose -f docker-compose.prod.yaml down

push:
    docker compose -f docker-compose.prod.yaml build --no-cache
    docker compose -f docker-compose.prod.yaml push

stop: dev-stop prod-stop
restart: stop dev

kill:
    docker compose -f docker-compose.dev.yaml down -v
    docker compose -f docker-compose.prod.yaml down -v
    docker volume prune
