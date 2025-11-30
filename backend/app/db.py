import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DB")
)
cursor = db.cursor(buffered=True)

def insert_image(filename, filepath):
    cursor.execute(
        "INSERT INTO images (filename, filepath) VALUES (%s, %s)",
        (filename, filepath)
    )
    db.commit()
    return cursor.lastrowid

def insert_label(image_id, label):
    cursor.execute(
        "INSERT INTO labels (image_id, label) VALUES (%s, %s)",
        (image_id, label)
    )
    db.commit()

def insert_model(name, filepath):
    cursor.execute(
        "INSERT INTO models (name, filepath) VALUES (%s, %s)",
        (name, filepath)
    )
    db.commit()
    return cursor.lastrowid

def link_image_model(model_id, image_id):
    cursor.execute(
        "INSERT INTO model_images (model_id, image_id) VALUES (%s, %s)",
        (model_id, image_id)
    )
    db.commit()

def get_models():
    cursor.execute("SELECT id, name, filepath, trained_at FROM models ORDER BY trained_at DESC")
    models = []
    for row in cursor.fetchall():
        models.append({
            "id": row[0],
            "name": row[1],
            "path": row[2],
            "created_at": row[3].isoformat() if row[3] else None,
            "status": "trained"
        })
    return models

def insert_trained_image(filename, filepath, model_id):
    cursor.execute(
        "INSERT INTO trained_images (filename, filepath, model_id) VALUES (%s, %s, %s)",
        (filename, filepath, model_id)
    )
    db.commit()
    return cursor.lastrowid

def insert_trained_label(trained_image_id, label):
    cursor.execute(
        "INSERT INTO trained_labels (trained_image_id, label) VALUES (%s, %s)",
        (trained_image_id, label)
    )
    db.commit()
