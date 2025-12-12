# CSCI 408 Capstone Project

This project is a full-stack web application with a React frontend and a Python (FastAPI) backend.  
The entire application is containerized using Docker for easy setup and deployment. 

FOR CSCI 408 PROFESSOR: MY SECURITY OPERATIONS REPORT IS THE OTHER MARKDOWN FILE NAMED ```SecurityOperationsReport.md```

---

## Technologies Used

### Frontend
- React
- Vite
- Lucide-React
- Vitest & Testing Library (unit and component testing)

### Backend
- Python 3
- FastAPI
- PostgreSQL

### Containerization
- Docker
- Docker Compose

---

## Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── server.py
├── docker-compose.yaml
├── Dockerfile
├── fuzzing.test.jsx
├── package.json
├── src
│   ├── App.jsx
│   ├── components
│   │   ├── FileUpload.jsx
│   │   ├── Login.jsx
│   │   └── ColorPicker.jsx
│   └── ...
└── ...
```

### Directory Overview

- `backend/` – Python FastAPI backend application
- `docker-compose.yaml` – Defines services, networks, and volumes for the multi-container app
- `Dockerfile` – Dockerfile for the React frontend
- `fuzzing.test.jsx` – Fuzzing tests for the application
- `package.json` – Project dependencies and scripts
- `src/` – Main source code for the React application
- `src/components/` – Reusable React components for the hero-style website

---

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Lucide-React (required to avoid frontend issues)

---

## Installation & Running the App

### 1. Clone the repository

```
git clone https://github.com/27greenballoons/csci408-final
```

### 2. Install backend dependencies (optional for local runs)

```
cd backend
pip install -r requirements.txt
```

### 3. Build and start the application

```
docker-compose up -d --build
```

- Frontend: http://localhost:8080  
- Backend: http://localhost:8000

---

## API Endpoints

The backend exposes the following endpoint for user authentication:

### POST /login

Authenticates a user.

**Request Body:**
```json
{
  "username": "your-username",
  "password": "your-password"
}
```

The backend server runs on port 8000.

---

## Testing

The project uses:
- Vitest and Testing Library for unit and component testing
- fast-check for fuzz testing

The fuzzing implementation is experimental and not fully optimized.  
It is intended to work with:
- File input handling
- VirusTotal integration

Fuzzing tests are located in:

```
fuzzing.test.js
```

---

## Dockerization

The application is fully containerized using Docker and Docker Compose.

### Services

The `docker-compose.yaml` file defines three services:

- `db` – PostgreSQL database (Postgres 15 image)
- `backend` – FastAPI backend service
- `frontend` – React frontend service

### Networking

- All services communicate over a custom bridge network named `appnet`

### Environment Variables

- The frontend uses a `.env` file for:
  - `VITE_VIRUS_TOTAL` (VirusTotal API key)

---

## Stopping the Application

To stop and remove the containers, run:

```
docker-compose down
```
