# Koa Login Practice
A toy project to practice implementing login session for koa server.

**Technology Stack** : Koa.js, Typescript, PostgreSQL, Redis

## How to Run
There is a `docker-compose.yml` file in `.devcontainer` directory to ease the setup process.
```bash
cd .devcontainer
docker-compose up
```

Otherwise, you can setup PostgreSQL and Redis servers manually.

Then, start the koa server.
```bash
npm ci
npx tsc
node dist/app.js
```
