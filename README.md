# Motor Insurance Pricing API

[![Node.js CI](https://github.com/GuillaumeGSO/motor-insurance-pricing/actions/workflows/node.js.yml/badge.svg)](https://github.com/GuillaumeGSO/motor-insurance-pricing/actions/workflows/node.js.yml)

This project is a NestJS-based API for managing motor insurance pricing. It includes features for creating, updating, retrieving, and deleting product pricing information based on product codes and locations.

## Table of Contents

- [Description](#description)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [Insert sample products / locations](#insert-sample-products--locations)
- [Running Tests](#running-tests)
- [Continuous Integration](#continuous-integration)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

## Description

The project is quite simple. One of the main requirements is to have a fast GET API to retrieve the price (also called premium).

The whole stack (PostgreSQL + the NestJS app) runs with Docker Compose, so the project is easy to test.

### A few comments about the project:

- The database contains one table, which is not optimal due to redundancy of product descriptions. Since the main API only returns premium:price, the product description could have been located in a separate table. However, this would have made the API to add/update/delete more complex.
- I noticed that for the update route, we chose to use a query parameter for the productCode, but location is in the body. I've assumed that was a design choice.
- The main search feature uses both product code and location, so the only required index is on these fields (with a unique constraint on the pair).
- Separation of concerns: controllers only know about DTOs, services manage DTO to entity conversion, and the built-in repository from TypeORM handles database interactions.
- The authentication service provides a JWT token that contains the user roles used to authorize routes.
- Token validation and admin authorization are handled by middleware.
- Ensure it is fast: I used Artillery load testing to ensure that the API is fast and can handle heavy loads.
- The premium route (`GET /product`) uses the NestJS built-in cache (in memory, 10 seconds TTL, 100 entries max).
- Services, controllers, middleware and interceptor are unit tested using Jest and mocking dependencies.
  Note that config, module files and `main.ts` are excluded from the coverage calculation.
- Set up a logger (Nest), with levels configurable through `LOG_LEVELS`.
- Created an interceptor for error handling.
- CORS is enabled for a local Vite frontend (`http://localhost:5173`).

Complementary approaches (not implemented):

- Redis cache
- PostgreSQL cache
- Fastify for faster/compressed/http2 compatible (note that the project payloads are very light)
- Horizontal scaling using a load balancer

### Project requirements

- All endpoints are documented in Swagger (annotations of controller methods).
- All endpoints deal with DTOs, with validations using standard Nest class-validators.
- The app contains one business module (product) that includes product DTOs, entities, controllers, middleware and services, plus an auth module that issues JWT tokens.
- The app connects to a PostgreSQL container started with Docker Compose. It relies on TypeORM and uses a central .env configuration file.
- Security:
  - A token (classical `Authorization: Bearer ...`) must be set for all admin routes (`POST`, `PUT`, `DELETE` on `/product`).
  - The token must contain the `admin` role, which is the case for tokens issued to the `admin` user.
- API is able to handle a lot of concurrent access out of the box, see [load testing](#load-testing)
- Unit tests cover the auth module, middleware and interceptor at 100%, see [test coverage](#test-coverage)

## Technology Stack

This project uses the following stack:

- **Node.js** (v24): A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building scalable network applications.
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **TypeORM**: ORM used for entities, repositories and migrations.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **Swagger**: A tool for documenting APIs, used to generate the API documentation available at `/api`.
- **Artillery**: A modern, powerful, and easy-to-use load testing toolkit.

## Requirements

Before setting up the project, ensure you have the following installed:

- Node.js 24 and npm
- Docker with Docker Compose
- artillery (optional, for load testing)

The Nest CLI is installed as a dev dependency, no global install is needed.

## Project Setup

To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/GuillaumeGSO/motor-insurance-pricing.git
   cd motor-insurance-pricing
   ```
2. Install the dependencies (the project folder, including `node_modules`, is mounted into the app container):
   ```bash
   npm install
   ```
3. Set up the environment variables by copying `.env.sample` to `.env` and filling in the required values:
   ```bash
   cp .env.sample .env
   ```

## Running the Application

### Development mode:

```bash
docker compose up
```

This starts two containers:

- `motor_insurance_db`: PostgreSQL 13, exposed on port 5432
- `motor_price_app`: the NestJS app in watch mode (`npm run start:dev`), exposed on port 3000

With `NODE_ENV=DEV`, TypeORM synchronizes the schema automatically on startup.

Keep `POSTGRES_HOST=127.0.0.1` in `.env` for commands run from your host (migrations): Docker Compose overrides the host and port inside the app container to reach `motor_insurance_db`.

## Insert sample products / locations

Run the migrations, either from your host:

```bash
npm run migration:run
```

or inside the app container:

```bash
docker exec -it motor_price_app npm run migration:run
```

This inserts:

- product codes `1000` to `9000` (Sedan, SUV, Hatchback...) for the 10 ASEAN countries, used by the load tests
- a larger random dataset (100 manufacturers x 100 countries)

## Running Tests

### Unit tests:

```bash
npm run test
```

### Test coverage:

```bash
npm run test:cov
```

The report is generated in the `coverage` folder.

### Lint:

```bash
npm run lint
```

### Load testing

Three scenarios are available in the `test` folder: `load-test-light.yml`, `load-test-medium.yml` and `load-test-fail.yml`. They call the premium route with the sample data, so run the migrations first.

Run the load test:

```bash
artillery run -o report-light.json test/load-test-light.yml
```

Generate the report:

```bash
artillery report report-light.json
```

View report: open `report-light.json.html`

Previous reports (with and without cache / index) are available in the `reports` folder.

## Continuous Integration

A GitHub Actions workflow ([.github/workflows/node.js.yml](.github/workflows/node.js.yml)) runs on every push and pull request to `master`, using Node.js 24: install, lint, build, and unit tests with coverage.

## Environment Variables

The application uses the following environment variables:

- `POSTGRES_HOST`: The host of the PostgreSQL database.
- `POSTGRES_PORT`: The port of the PostgreSQL database.
- `POSTGRES_USER`: The username for the PostgreSQL database.
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
- `POSTGRES_DATABASE`: The name of the PostgreSQL database.
- `POSTGRES_LOG`: Set to `true` to log SQL queries (optional).
- `PORT`: The port on which the application will run (default 3000).
- `NODE_ENV`: The environment in which the application is running (e.g., DEV, PROD). `DEV` enables TypeORM schema synchronization.
- `JWT_SECRET`: Key to sign and verify JWT tokens.
- `LOG_LEVELS`: Comma separated log levels for the application (`log,error,warn,debug,verbose`).

## API Documentation

The API documentation is available at `/api` when the application is running. It provides detailed information about the available endpoints and their usage.
http://localhost:3000/api

Note: you can use the Swagger interface to insert data into the DB.

### Endpoints

| Method | Route                                          | Auth  | Description                                      |
| ------ | ---------------------------------------------- | ----- | ------------------------------------------------ |
| POST   | `/auth/login`                                  | -     | Get a JWT token                                  |
| GET    | `/product?productCode=&location=`              | -     | Get the premium (cached)                         |
| GET    | `/product/count`                               | -     | Count products                                   |
| GET    | `/product/locations`                           | -     | List distinct locations                          |
| GET    | `/product/productsForLocation?location=`       | -     | List products available for a location           |
| POST   | `/product`                                     | admin | Create a product for a location                  |
| PUT    | `/product?productCode=`                        | admin | Update price and description for a location      |
| DELETE | `/product?productCode=`                        | admin | Delete a product code in all locations           |

### API Call Examples

In the `tools` folder, there is a Postman collection to use all the routes.

#### Authenticate

Two demo users are available: `admin` / `admin` (roles admin and user) and `user` / `user` (role user only).

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "admin"}'
```

This provides a JWT token (`access_token`) that needs to be used for all admin routes.

#### Create one product

```bash
curl -X POST http://localhost:3000/product \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "productCode": "1000",
  "productDesc": "Sedan",
  "location": "Malaysia",
  "price": 300
}'
```

Note: a product code can only exist once per location, so this fails if the sample data is already loaded.

#### Update one product

```bash
curl -X PUT "http://localhost:3000/product?productCode=1000" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "description": "Sedan 4WD",
  "location": "Malaysia",
  "price": 333
}'
```

#### Delete one product

```bash
curl -X DELETE "http://localhost:3000/product?productCode=1000" \
-H "Authorization: Bearer <your_token>"
```

#### Get premium

This is a public route, no authorization required. Location is case sensitive.

```bash
curl "http://localhost:3000/product?productCode=1000&location=Malaysia"
```
