# OctoCAT Supply Chain Management Application

## GitHub Repo Information

This repo is hosted in GitHub:
- owner: <$ demo_org.owner $>
- repo: <$ demo_instance_name $>

## Architecture

The complete architecture is described in the [Architecture Document](../docs/architecture.md).
SQLite database integration details are in [SQLite Integration](../docs/sqlite-integration.md).

# Build and Run Instructions

Refer to [build instructions](../docs/build.md) for detailed build instructions.

Every time you change the code, make sure that the code compiles by running:

```bash
npm run build
```

To run the unit tests for the API, run:

```bash
npm run test:api
```

## Database management (API workspace)

```bash
# Initialize DB (migrations + seed)
npm run db:init --workspace=api

# Run migrations only
npm run db:migrate --workspace=api

# Seed data only
npm run db:seed --workspace=api
```
