# Motor Insurance Pricing API

This project is a NestJS-based API for managing motor insurance pricing. It includes features for creating, updating, retrieving, and deleting product pricing information based on product codes and locations.

## Table of Contents

- [Description](#description)
- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Support](#support)
- [License](#license)

## Description

The project is quite simple. One of the main requirements is to have a fast GET API to retrieve the price (also called premium).

First of all, I decided to embed PostgreSQL into a container so the project would be easier to test.
I've created a branch (WIP) with a full Docker Compose approach: https://github.com/GuillaumeGSO/motor-insurance-pricing/tree/got_to_full_docker.

### A few comments about the project:

- One table in the collection: the table is not optimal due to redundancy of product descriptions. Since the main API only returns premium:price, the product description could have been located in a separate table. However, the API to add/update/delete would have been more complex.
- I noticed that for the update route, we chose to use a query parameter for the productCode, but location is in the body. I've assumed that was a design choice.
- The main search feature uses both product code and location, so the only required index is on these fields.
- Separation of concerns: controllers only know about DTOs, services manage DTO to entity conversion, and the built-in repository from TypeORM handles database interactions.
- Ensure it is fast: I used Artillery load testing to ensure that the API is fast and can handle heavy loads.
- Middleware created to handle token validation and admin access.
- Set up a logger (Nest).
- Created an interceptor for error handling.

Complementary approaches (not implemented):

- NestJS built-in cache
- Redis cache
- PostgreSQL cache
- Fastify for faster/compressed/http2 compatible (note that the project payload are very light)
- Horizontal scaling using a load balancer
-

### Project requirements

- All endpoints are documented in Swagger (annotations of controller methods).
- All endpoints deal with DTOs, with validations using standard Nest class-validators.
- The app contains one module (product) that includes product DTOs, entities, controllers, and services.
- The app connects to a PostgreSQL container initiated during startup. It relies on TypeORM and uses a central .env configuration file.
- Security:
  - A token (classical `Authorization Bearer...`) must be set for all admin routes (other than GET).
  - A role "admin" must be set in the `x-role` header.
- A branch is created (WIP) with a deployment ready approach
- API is able to handle a lot of concurrent access out of the box. This

## Technology Stack

This project uses the following stack:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building scalable network applications.
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **Swagger**: A tool for documenting APIs, used to generate the API documentation available at `/api`.
- **Artillery**: A modern, powerful, and easy-to-use load testing toolkit.

## Requirements

Before setting up the project, ensure you have the following installed:

- nodejs
- npm
- @nestjs/cli
- docker
- artillery (optional)

## Project Setup

To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/GuillaumeGSO/motor-insurance-pricing.git
   cd motor-insurance-pricing
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables by copying `.env.sample` to `.env` and filling in the required values:
   ```bash
   cp .env.sample .env
   ```

## Running the Application

To run the application, use the following commands:

### Development mode:

```bash
npm run start:dev:db
npm run start:dev
```

## Insert sample products / locations

```bash
npm run migration:run
```

## Running Tests

To run the tests, use the following commands:

### Unit tests:

```bash
npm run test
```

### Test coverage:

```bash
npm run test:cov
```

### Load testing:

```bash
artillery run test/load-test.yml
```

## Environment Variables

The application uses the following environment variables:

- `POSTGRES_HOST`: The host of the PostgreSQL database.
- `POSTGRES_PORT`: The port of the PostgreSQL database.
- `POSTGRES_USER`: The username for the PostgreSQL database.
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
- `POSTGRES_DATABASE`: The name of the PostgreSQL database.
- `PORT`: The port on which the application will run.
- `NODE_ENV`: The environment in which the application is running (e.g., DEV, PROD).
- `RUN_MIGRATIONS`: Whether to run database migrations on startup.
- `API_TOKEN`: The API token for authentication.
- `LOG_LEVELS`: The log levels for the application.

## API Documentation

The API documentation is available at `/api` when the application is running. It provides detailed information about the available endpoints and their usage.
http://localhost:3000/api

Note : you can use swagger interface to insert data into the DB.

### Api call sample

#### Create one product

```
curl -X POST http://localhost:3000/product \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-H "x-role: admin" \
-d '{
  "productCode": "1000",
  "productDesc": "Sedan",
  "location": "Malaysia",
  "price": 300
}'
```

#### Update one product

```bash
curl -X PUT http://localhost:3000/product?productCode=1000 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-H "x-role: admin" \
-d '{
  "productDesc": "Sedan 4WD",
  "location": "Malaysia",
  "price": 333
}'
```

#### Get premium

```bash
curl "http://localhost:3000/product?productCode=1000&location=Malaysia"
```

#### Delete one product

```bash
curl -X DELETE "http://localhost:3000/product?productCode=1000" \
-H "Authorization: Bearer <your_token>" \
-H "x-role: admin"
```
