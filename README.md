# LegalFlow

LegalFlow is a **Legal case management system** for managing cases, lawyers, clients, hearings, and documents in one place.

## Features

* User authentication & role-based access
* Case creation and management
* Lawyer assignment
* Hearing tracking
* Document management
* Dashboard & case statistics
* AI-powered document summarization
* Email notifications/reminders

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Fastify
**Database:** PostgreSQL, Sequelize
**Authentication:** JWT, bcrypt
**Deployment:** Docker, AWS EC2/RDS, GitHub Actions

## Project Structure

```text
LegalFlow/
├── LegalFlow/          # React frontend
├── backend/            # Fastify backend
├── docker-compose.yml
└── README.md
```

## Setup

### Frontend

```bash
cd LegalFlow
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `.env` files with your database and authentication configuration.

## Run with Docker

```bash
docker compose up --build
```

## Environment Variables

```env
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
```

## Main Roles

* **Admin** – manage users, lawyers and cases
* **Lawyer** – manage assigned cases and hearings
* **Client** – create and track cases

## License

This project is developed as part of the **Qualwebs** Training.
