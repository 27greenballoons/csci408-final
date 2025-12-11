# Web Interface

This project is a full-stack web application with a React frontend and a Python (FastAPI) backend. The entire application is containerized using Docker for easy setup and deployment.

## Technologies Used

- **Frontend:**
  - React
  - Vite
  - Express
  - Lucide-React
  - fast-check (for fuzz testing)
  - Vitest, Testing Library (for unit and component testing)
- **Backend:**
  - Python 3
  - FastAPI
  - PostgreSQL
- **Containerization:**
  - Docker
  - Docker Compose

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

- `backend/`: Contains the Python FastAPI backend application.
- `docker-compose.yaml`: Defines the services, networks, and volumes for the multi-container Docker application.
- `Dockerfile`: The Dockerfile for the frontend React application.
- `fuzzing.test.jsx`: Contains the fuzzing tests for the application.
- `package.json`: Lists the project dependencies and scripts.
- `src/`: The main source code for the React application.
- `src/components`: Contains the reusable React components for the hero style website.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed, get Lucide React to avoid frontend issues.

### Installation & Running the app

1. **Clone the repository:**
   ```
   git clone https://github.com/27greenballoons/csci408-final
   ```
2. **Get :**
   ```
  cd backend
  pip install requirements.txt
   ```
2. **Build and run the application using Docker Compose:**
   ```
   docker-compose up -d --build
   ```
This command will build the Docker images for the frontend and backend services and start the containers. The frontend will be accessible at `http://localhost:8080`, and the backend will be running on port `8000`.

## API Endpoints

The backend exposes the following API endpoint for user "log-ins":

- **`POST /login`**: Authenticates a user.
  - **Request Body:**
    ```json
    {
      "username": "your-username",
      "password": "your-password"
    }
    ```

## Testing

The project uses Vitest and Testing Library for unit and component testing, and `fast-check` for fuzz testing.

These are not implemented in the best way possible, but I wanted to have some kind of experience with fuzzing for this project, its supposed to work with the file input and VirusTotal part. 

The fuzzing tests are in `fuzzing.test.js`

## Dockerization

The application is fully containerized using Docker and Docker Compose. The `docker-compose.yaml` file defines three services:

- **`db`**: A PostgreSQL database service.
- **`backend`**: The Python FastAPI backend service.
- **`frontend`**: The React frontend service.

The services are connected via a custom bridge network called `appnet`.
The `db` service is using a postgres 15 image and the `backend` and `frontend` services have their own Dockerfile.
The `frontend` service uses `.env` to get VITE_VIRUS_TOTAL for the VirusTotal API calls 

To stop the application, run:

```
docker-compose down
```