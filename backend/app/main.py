from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from .db import insert_image, insert_label
from .predict import predict

app = FastAPI(title="Local Image Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Save uploaded image ---
def save_uploaded_image(file: UploadFile):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path

# --- Upload endpoint ---
@app.post("/upload")
async def upload_image(file: UploadFile = File(...), label: str = None):
    file_path = save_uploaded_image(file)
    image_id = insert_image(file.filename, file_path)
    if label:
        insert_label(image_id, label)
    return {"status": True, "image_id": image_id, "filename": file.filename}

# --- Predict endpoint ---
@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    file_path = save_uploaded_image(file)   
    label, confidence = predict(file_path)

    image_id = insert_image(file.filename, file_path)
    insert_label(image_id, label)

    return {"status": True, "prediction": label, "confidence": confidence}
