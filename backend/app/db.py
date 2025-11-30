from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from .db import insert_image, insert_label, insert_model, link_image_model
from .predict import predict
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

app = FastAPI(title="Local Image Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = "dataset"
os.makedirs(BASE_DIR, exist_ok=True)
MODEL_PATH = "model/latest_model.h5"
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)


# --- Save uploaded image to label folder ---
def save_uploaded_image(file: UploadFile, label: str):
    label_dir = os.path.join(BASE_DIR, label)
    os.makedirs(label_dir, exist_ok=True)

    file_path = os.path.join(label_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path


# --- Simple training function ---
def train_model():
    datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
    train_gen = datagen.flow_from_directory(
        BASE_DIR,
        target_size=(64, 64),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )
    val_gen = datagen.flow_from_directory(
        BASE_DIR,
        target_size=(64, 64),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )

    # Simple CNN model
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
        MaxPooling2D(2, 2),
        Flatten(),
        Dense(128, activation='relu'),
        Dense(train_gen.num_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    model.fit(train_gen, validation_data=val_gen, epochs=5)

    model.save(MODEL_PATH)
    model_id = insert_model("latest_model", MODEL_PATH)

    # Link images to this new model
    for label_folder in os.listdir(BASE_DIR):
        folder_path = os.path.join(BASE_DIR, label_folder)
        for img_file in os.listdir(folder_path):
            image_id = insert_image(img_file, os.path.join(folder_path, img_file))
            insert_label(image_id, label_folder)
            link_image_model(model_id, image_id)

    return model


# --- Upload endpoint ---
@app.post("/upload")
async def upload_image(file: UploadFile = File(...), label: str = None):
    if not label:
        label = os.path.splitext(file.filename)[0]  # use filename as label if none provided
    file_path = save_uploaded_image(file, label)

    # Update database
    image_id = insert_image(file.filename, file_path)
    insert_label(image_id, label)

    # Train model automatically with new image
    train_model()

    return {"status": True, "image_id": image_id, "filename": file.filename, "label": label}


# --- Predict endpoint ---
@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    label, confidence = predict(file_path)

    # Insert into database
    image_id = insert_image(file.filename, file_path)
    insert_label(image_id, label)

    return {"status": True, "prediction": label, "confidence": confidence}
