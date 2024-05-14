# Express-Drizzle-PostgreSQL-Starter

A opinionated starter template for building REST APIs with Express, Drizzle ORM and PostgreSQL.

## Features

- [x] User registration
- [x] User verification via email
- [x] User deletion
- [x] Admin routes

## API Documentation

### `GET /user`

Returns the user. Requires `AUTH_TOKEN` in the request header.

### `PUT /user/update`

Updates the user. Requires `AUTH_TOKEN` in the request header.

User can only update themselves. Properties that can be updated are `name`, `email` and `password`.

if `email` is updated, the user will be unverified and a new verification email will be sent.

### `POST /user/create`

Creates a new user. Requires `name`, `email` and `password` in the request body.

<img height="auto" width="750" src="https://github.com/jatindotdev/express-drizzle-postgres-starter/assets/59236972/f31e266e-68c3-44be-a0b2-d07c15ee83c6" />

<img height="auto" width="750" src="https://github.com/jatindotdev/express-drizzle-postgres-starter/assets/59236972/f3763930-d88c-471c-85f3-eb7dfba350e5" />

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
