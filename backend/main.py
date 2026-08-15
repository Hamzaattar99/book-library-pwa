from fastapi import FastAPI

from app.config import settings
from app.routes.push import router as push_router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="BookVerse Push Backend",
    description="Backend API for BookVerse Push Notifications",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5600",
        "http://127.0.0.1:5600"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"]
)



app.include_router(
    push_router
)


@app.get("/")
def root():
    """
    Basic health check.
    """

    return {
        "application": "BookVerse",
        "service": "Push Notification Backend",
        "status": "running"
    }


@app.get("/api/push/vapid-public-key")
def get_vapid_public_key():
    """
    Return the VAPID public key.

    The public key is safe to expose
    to the frontend.
    """

    return {
        "publicKey": settings.VAPID_PUBLIC_KEY
    }