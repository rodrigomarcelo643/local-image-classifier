import os
from fastapi import UploadFile
from ..config import DATASET_DIR, UPLOAD_DIR

def save_uploaded_image(file: UploadFile, label: str):
    label_dir = os.path.join(DATASET_DIR, label)
    os.makedirs(label_dir, exist_ok=True)
    file_path = os.path.join(label_dir, file.filename)
    file.file.seek(0)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path

def save_temp_file(file: UploadFile):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path