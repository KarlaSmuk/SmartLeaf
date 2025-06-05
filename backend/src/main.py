from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.auth import router as auth_router
from controllers.plant import router as plant_router
from controllers.notification import router as notification_router
from controllers.sensor_reading import router as sensor_router
from controllers.watering_event import router as watering_router
from controllers.user import router as user_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ["*"] for all origins (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)

app.include_router(plant_router)
app.include_router(sensor_router)
app.include_router(notification_router)
app.include_router(watering_router)