# NestJs BoilerPlate by :cloud:

<p  align="center">
<a  href="#"  target="blank"><img  src="https://upload.wikimedia.org/wikipedia/commons/3/37/NestJS-logo-wordmark.svg"  height="120"  alt="BoilerPlate Logo" /></a>
</p>

This project serves as a ready-to-go boilerplate for creating efficient, scalable server-side applications utilizing [NestJS](https://nestjs.com/), which is a framework for building server-side applications in Node.js. It comes with a pre-configured set of tools and features to jumpstart your project development instantly.

<br/>
<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,nestjs,redis,prisma,postgres,docker" />
</p>
<br/>

## :rocket: Why Use This Repository

This starter repository is designed to jumpstart development of server-side applications with NestJS, providing a comprehensive setup out-of-the-box.

🔑 Key Features

**`Dockerized Environment`**

- Pre-configured Docker setup ensures consistent environments for development and production.
- Services like PostgreSQL, Redis, and Maildev are pre-integrated.

**`Pre-configured Services`**

- PostgreSQL for reliable database management.
- Redis for caching, session management, and rate limiting.
- Maildev for local email testing.

**`Authentication and Authorization`**

- JWT Authentication and Passport.js integration.
- Role-based access control with customizable RolesGuard.
- Built-in throttling using NestJS Throttler for brute-force protection.
- Multiple authentication methods:
  - Email and password
  - Google OAuth
  - Facebook OAuth
  - Apple OAuth

**`API Documentation`**

- Fully integrated Swagger documentation for easy API exploration.
- Real-time updates and interactive API testing.

**`Push Notifications`**

- Integrated OneSignal notifications for push notifications.
- Modular design for easily extending support to other notification services.

**`Prisma ORM`**

- Prisma is configured for database migrations, schema management, and querying.
- Includes Prisma Studio for intuitive database visualization.

**`Email Integration`**

- Configured with Nodemailer for sending emails.
- Maildev for testing email functionalities locally.

**`Rate Limiting and Security`**

- Implemented rate limiting with NestJS Throttler to handle API abuse.
- Integrated Helmet to enforce security headers.
- Protection against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).

**`Health Checks`**

- Monitor application health with @nestjs/terminus.
- Includes checks for database connectivity, Redis, and application uptime.

**`Logging and Error Handling`**

- Centralized error handling with clear and structured error messages.
- Configured Winston for flexible and scalable logging.

**`Internationalization (i18n)`**

- Fully integrated with nestjs-i18n for multi-language support.
- Easy localization of error messages and responses.

**`Developer Experience`**

- Integrated ESLint, Prettier, and Husky to maintain consistent code quality.
- Ready-to-use scripts for testing, building, and deploying the application.
- Supports live reload during development with start:dev.

**`Cache and Performance Optimization`**

- Redis caching layer for faster API responses.
- Built-in decorators for caching frequently accessed data.

**`Code Documentation`**

- Supports generating static code documentation using Compodoc.

**`File Management`**

- Example implementation for file uploads and downloads.
- Multer configured for handling file streams.

By using this boilerplate, developers can save time on setup and configuration, allowing them to focus on building the unique features of their application. The repository aims to provide a solid foundation with best practices and tools that are commonly required for modern application development.

## :information_source: Features

- **`Docker Support`**: Facilitates development and deployment processes with Docker and Docker Compose configurations.

- **`Swagger Documentation`**: Offers automatically generated API documentation using Swagger to ease the API design, build, and testing process.

- **`Environment Variables Management`**: Comes with a `.env.example` file for straightforward environment variable management.

- **`Code Quality Tools`**: Includes setup for ESLint, Prettier, and Husky to ensure code quality and consistency.

- **`Testing Framework`**: Provides a basic configuration for conducting unit and integration tests with Jest.

- **`Continuous Integration`**: Contains a basic CI configuration to fit into your CI/CD workflow seamlessly.

## :information_source: Getting Started

**The `easiest way to get the project up and running` :eyes: is to use Docker. Here’s a simple guide to follow**:

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.

2. Open the Docker application to ensure it's running.

3. Open a terminal in the project's root directory.
4. Create `.env` and pass variables.

5. Execute the command: `npm run init`

After completing the above steps, the project will be launched using Docker, including all necessary dependencies and services.

### Prerequisites

- Node.js

- Docker & Docker Compose (for a containerized environment setup)

### Installation

1. Clone the repository: `git clone https://github.com/jeziorskilukasz/nestjs-boilerplate`

2. Install the dependencies: if you're using yarn: `yarn install` or if you prefer npm: `npm install`

3. Prepare your environment variables by copying the `.env.example` file to `.env` and adjust the variables as per your project's requirements. Variables are validated so please make sure you have filled every key with proper value.

### Running the Application

For development mode: `npm run start:dev`

For production mode: `npm run start:prod`

### Using Docker Environment

Deploy the application in a Docker environment using the following command: `docker-compose up -d`

This command sets up the application and any required services (like databases, mail servers, etc.) as defined in your docker-compose.yml.

## :information_source: Scripts Overview

- `apiDocs:open` Opens the Swagger API documentation in your default browser.

- `build` Compiles the application into JavaScript.

- `format` Formats the source code using Prettier.

- `init` Performs initial setup tasks including building Docker images, running migrations, seeding the database, opening mail client for development, and opening API documentation.

- `lint` Runs ESLint to identify and fix code quality issues.

- `mailClient:open` Opens the local development mail client.

- `prisma:generate` Generates Prisma client.

- `prisma:studio` Opens Prisma Studio for database management.

- `push:run` Pushes the database schema changes using Prisma.

- `seed:run` Seeds the database with initial data using Prisma.

- `test`, `test:cov`, `test:debug`, `test:e2e`, `test:watch` Various scripts to run tests and generate coverage reports.

## :information_source: Docker Configuration Overview

The project uses Docker to run several services essential for its operation. Here is a basic overview of these services:

- **`API`**: The main service of the application, accessible at `http://localhost:3000`. It runs in development mode with hot code reloading.

- **`Redis`**: Used for caching, sessions, etc., available on port `6379`.

- **`Postgres`**: PostgreSQL database, available on port `5432`. Database data is persistently stored using Docker volumes.

- **`Maildev`**: Email testing tool, accessible at `http://localhost:<MAIL_CLIENT_PORT>`, where `<MAIL_CLIENT_PORT>` is defined in the `.env` file (in general 1080). It allows capturing and viewing emails sent by the application during development.

- **`PgAdmin`**: PostgreSQL UI, accessible at `http://localhost:5050`. It enables database management through a web interface.

### Prisma Studio

To open Prisma Studio, a tool for visualizing and managing database data, run the command `npx prisma studio` after starting the Docker services. It will be accessible at the address shown in the terminal, typically `http://localhost:5555`.

## :information_source: Important Commands

- `npm run start:dev` - Starts the application in development mode.

- `npm run docker:down` - Stops and removes Docker containers launched by `docker-compose up`.

## :file_folder: API Documentation

For local development navigate to http://localhost:3000/docs to view the Swagger UI, which provides detailed documentation and testing capabilities for your API.

## :eyeglasses: Contributing

We welcome contributions! Please consult our contribution guidelines for details on how to make a pull request, report issues, or suggest new features.

## 📘 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

## 📝 Feedback

If you have any feedback, please reach out to [Lukasz Jeziorski](mailto:l.jeziorski@outlook.com).
