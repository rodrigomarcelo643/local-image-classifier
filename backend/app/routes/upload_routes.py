from fastapi import APIRouter, UploadFile, File
from ..services.file_service import save_uploaded_image
from ..db import insert_image, insert_label

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), label: str = None):
    try:
        if not label:
            import os
            label = os.path.splitext(file.filename)[0]

        file_path = save_uploaded_image(file, label)
        image_id = insert_image(file.filename, file_path)
        insert_label(image_id, label)

        return {"status": True, "image_id": image_id, "filename": file.filename, "label": label}
    except Exception as e:
        print(f"Upload error: {e}")
        return {"status": False, "error": str(e)}