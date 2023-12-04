# Express-Drizzle-PostgreSQL-Starter

A starter template for building REST APIs with Express, Drizzle ORM and PostgreSQL.

## Features

- [x] User registration
- [x] User verification via email
- [x] User deletion
- [x] Admin routes

## API Documentation

### `GET /user`

Returns the user. Requires `AUTH_TOKEN` in the request header.

### `POST /user/create`

Creates a new user. Requires `name`, `email` and `password` in the request body.

### `GET /user/verify`

Verifies the user. Requires `token` and `email` in the query string.

### `DELETE /user/remove`

Removes the user. Requires `AUTH_TOKEN` in the request header.

A user can only remove themselves.
A admin can remove any user.

### `POST /user/login`

Logs in the user. Requires `email` and `password` in the request body.

### `GET /admin/all-users`

Returns all users. It is an admin route, requires `AUTH_TOKEN`.

### `GET /admin/all-verfied-users`

Returns all verified users. It is an admin route, requires `AUTH_TOKEN`.

### `DELETE /admin/remove-unverified-users`

Removes all unverified users. It is an admin route, requires `AUTH_TOKEN`.

### Running the app

Install the dependencies

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

### Built with

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [drizzle-orm](https://orm.drizzle.team/)
- [Zod](https://zod.dev/)
- [drizzle-zod](https://orm.drizzle.team/docs/zod)
- [TypeScript](https://www.typescriptlang.org/)
- [react-email](https://react.email/)
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/)
