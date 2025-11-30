from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .config import DATASET_DIR
from .routes.upload_routes import router as upload_router
from .routes.prediction_routes import router as prediction_router
from .routes.training_routes import router as training_router
from .routes.data_routes import router as data_router

app = FastAPI(title="Local Image Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory="dataset"), name="static")

# Include routers
app.include_router(upload_router)
app.include_router(prediction_router)
app.include_router(training_router)
app.include_router(data_router)