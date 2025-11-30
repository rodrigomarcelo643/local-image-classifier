from fastapi import APIRouter
from ..db import get_models, cursor

router = APIRouter()

@router.get("/models")
async def list_models():
    models = get_models()
    return {"status": True, "models": models}

@router.get("/labels")
async def get_labels():
    cursor.execute("SELECT DISTINCT label FROM labels")
    labels = [row[0] for row in cursor.fetchall()]
    return {"status": True, "labels": labels}

@router.get("/sample-images/{label}")
async def get_sample_images(label: str):
    cursor.execute("""
        SELECT i.filename, i.filepath 
        FROM images i 
        JOIN labels l ON i.id = l.image_id 
        WHERE l.label = %s 
        LIMIT 3
    """, (label,))
    images = [{"filename": row[0], "filepath": row[1]} for row in cursor.fetchall()]
    return {"status": True, "images": images}

@router.get("/training-data")
async def get_training_data():
    cursor.execute("""
        SELECT tl.label, COUNT(*) as count, 
               GROUP_CONCAT(ti.filename LIMIT 3) as sample_files
        FROM trained_labels tl 
        JOIN trained_images ti ON tl.trained_image_id = ti.id 
        GROUP BY tl.label
    """)
    training_data = []
    for row in cursor.fetchall():
        label, count, sample_files = row
        files = sample_files.split(',') if sample_files else []
        training_data.append({
            "label": label,
            "count": count,
            "sample_files": files[:3]
        })
    return {"status": True, "training_data": training_data}

@router.get("/uploaded-data")
async def get_uploaded_data():
    cursor.execute("""
        SELECT l.label, COUNT(*) as count, 
               GROUP_CONCAT(i.filename LIMIT 3) as sample_files
        FROM labels l 
        JOIN images i ON l.image_id = i.id 
        WHERE i.filepath LIKE '%dataset/train%'
        GROUP BY l.label
    """)
    uploaded_data = []
    for row in cursor.fetchall():
        label, count, sample_files = row
        files = sample_files.split(',') if sample_files else []
        uploaded_data.append({
            "label": label,
            "count": count,
            "sample_files": files[:3]
        })
    return {"status": True, "uploaded_data": uploaded_data}

@router.get("/training-images/{label}")
async def get_training_images(label: str):
    cursor.execute("""
        SELECT ti.filename, ti.filepath 
        FROM trained_images ti 
        JOIN trained_labels tl ON ti.id = tl.trained_image_id
        WHERE tl.label = %s
    """, (label,))
    images = [{"filename": row[0], "filepath": row[1]} for row in cursor.fetchall()]
    return {"status": True, "images": images}