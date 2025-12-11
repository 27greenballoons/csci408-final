from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",     # allow all origins (Firefox same-site fix)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginPayload(BaseModel):
    username: str
    password: str

def db():
    return psycopg2.connect(
        host="db",
        database="logins",
        user="postgres",
        password="postgres"
    )

@app.post("/login")
def login(payload: LoginPayload):
    conn = db()
    cur = conn.cursor()

    # Create table if needed
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        );
    """)

    # Default users
    cur.execute("""
        INSERT INTO users (username, password)
        VALUES ('admin', 'secret')
        ON CONFLICT (username) DO NOTHING;
    """)

    cur.execute("""
        INSERT INTO users (username, password)
        VALUES ('greenballoons', 'Patel123')
        ON CONFLICT (username) DO NOTHING;
    """)

    conn.commit()

    # Validate login
    cur.execute("""
        SELECT * FROM users 
        WHERE username = %s AND password = %s;
    """, (payload.username, payload.password))

    result = cur.fetchone()

    cur.close()
    conn.close()

    if not result:
        return JSONResponse(content={"message": "Invalid username or password."})

    return JSONResponse(content={"message": "Login success!"})
