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

This API allows users to manage motor insurance pricing information. It includes endpoints for creating, updating, retrieving, and deleting product pricing information based on product codes and locations.

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
