# PostgreSQL and Drizzle ORM rules

## Scope and layout

- PostgreSQL and Drizzle ORM are not installed yet. Apply these rules when database work is introduced; do not add either dependency without a concrete feature that needs persistence.
- Keep database-only code under `src/db`, with the Drizzle schema in `src/db/schema` and the database client in `src/db/index.ts`. Keep generated SQL migrations in `drizzle/` and commit them.
- Keep the database client server-only. Never import it into a Client Component or expose database credentials through `NEXT_PUBLIC_*` variables.
- Read the connection string from a server environment variable and validate required configuration at startup.

## Schema and queries

- Make the schema express real invariants: primary keys, `NOT NULL`, foreign keys, `UNIQUE`, and `CHECK` constraints where appropriate. Application validation complements, but does not replace, database constraints.
- Use `timestamptz` for instants in time and store timestamps in UTC. Use a database-generated primary key unless a stable externally generated identifier is required.
- Add indexes only for demonstrated query, sort, join, or uniqueness needs. Consider index write cost and verify non-trivial queries with `EXPLAIN (ANALYZE, BUFFERS)`.
- Use Drizzle's typed query API and parameter binding. Never construct raw SQL by concatenating user input.
- Use transactions for changes that must succeed or fail together. Avoid N+1 query patterns; fetch related data intentionally.

## Migration workflow

- Treat the TypeScript schema and committed generated SQL migrations as the reviewed history of database changes.
- For normal development: change the schema, run `drizzle-kit generate --name <meaningful-name>`, review the generated SQL, then apply it with `drizzle-kit migrate`.
- Do not use `drizzle-kit push` against shared, staging, or production databases. Never use a data-loss acceptance flag without an explicit, reviewed migration plan and backup.
- Prefer additive, backward-compatible migrations. Split destructive changes into deploy-safe stages: add and backfill, deploy compatible code, then remove old data or columns later.

## Sources

- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [Drizzle configuration](https://orm.drizzle.team/docs/drizzle-config-file)
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)
