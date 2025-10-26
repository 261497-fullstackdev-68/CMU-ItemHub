# Term Backend

A NestJS backend service for equipment loan management system (under development).

## Tech Stack

- NestJS
- PostgreSQL
- Prisma ORM
- Docker
- TypeScript

## Prerequisites

- Node.js (v24+)
- pnpm
- Docker & Docker Compose
- PostgreSQL

## Getting Started

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PROJECT_NAME=your-project-name
DATABASE_PORT=your-database-port
POSTGRES_USER=your-db-user
POSTGRES_PASSWORD=your-db-password
POSTGRES_DB=your-db-name
DATABASE_URL="postgresql://your-db-user:your-db-password@localhost:your-database-port/your-db-name"
BACKEND_PORT=your-backend-port
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### Development

```bash
# Run in development mode
pnpm run start:dev

# Run tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up -d
```

## Database Schema (Current)

- User
- Organization
- Category
- Equipment
- EquipmentLoan

## Current API Endpoints

- `GET /getHello` - Test endpoint
- `GET /getAllUsers` - Retrieve all users (testing)

## Development Status

This project is currently in early development. Current implementation includes:

- Basic project setup
- Database connection with Prisma
- Initial schema design
- Docker configuration
- Basic test endpoints

## Contributing

This project is under active development. Please refer to the issue tracker and project documentation for contribution guidelines.