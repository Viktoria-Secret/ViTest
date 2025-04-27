# Vik.tor Internet Access Management

Vik.tor is a system for managing internet access on ships through PIN codes based on crew rank.

## Architecture

The system consists of:

- **PostgreSQL** database for storing crew ranks, PIN codes, and usage data
- **Redis** for Celery task queue and result storage
- **FastAPI** backend with RESTful endpoints for PIN management
- **Celery** workers for background tasks and scheduled maintenance
- **Next.js** frontend for crew to request and view their PINs

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/vik.tor.git
   cd vik.tor
   ```

2. Create a `.env` file based on the example:
   ```
   cp .env.example .env
   ```

3. Customize the environment variables in `.env` file:
   - Set database credentials
   - Configure MikroTik router connection
   - Set API keys

4. Start the application:
   ```
   docker compose up -d
   ```

5. Access the services:
   - Frontend: http://localhost:3000
   - API documentation: http://localhost:8000/docs
   - Database is accessible on port 5432

### Database Initialization

The database is automatically initialized with the table schema and initial crew rank data when the PostgreSQL container starts, using the `init.sql` script in the `backend` directory.

If you need to manually reset or update the database:

```
# Connect to the database
docker exec -it viktor-db psql -U viktor -d viktor

# Or run a SQL script
cat backend/init.sql | docker exec -i viktor-db psql -U viktor -d viktor
```

## Services

### FastAPI Backend

- **Main API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Celery Workers

- **Regular worker**: Processes asynchronous tasks like PIN generation
- **Beat scheduler**: Runs periodic tasks like quota resets

### Frontend

- User interface for crew to request PIN codes
- Display of PIN information and usage data
- Accessible at http://localhost:3000

## Development

To build and run the services locally:

```
# Build all containers
docker compose build

# Run all services
docker compose up -d

# View logs
docker compose logs -f

# Restart a specific service
docker compose restart backend
```

## License

[Add your license information here]