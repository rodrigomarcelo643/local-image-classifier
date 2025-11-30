import os
import glob
import shutil
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D
from ..config import DATASET_DIR, MODEL_PATH, TRAINING_CONFIG
from ..db import insert_model, insert_trained_image, insert_trained_label, cursor

training_status = {"is_training": False, "progress": ""}

def get_training_status():
    return training_status

def train_model_with_labels(selected_labels):
    temp_dataset_dir = "dataset/temp_train"
    
    if os.path.exists(temp_dataset_dir):
        shutil.rmtree(temp_dataset_dir)
    
    os.makedirs(temp_dataset_dir, exist_ok=True)
    
    for label in selected_labels:
        src_dir = os.path.join(DATASET_DIR, label)
        dst_dir = os.path.join(temp_dataset_dir, label)
        if os.path.exists(src_dir):
            shutil.copytree(src_dir, dst_dir)
    
    result = _train_model_from_directory_with_labels(temp_dataset_dir, selected_labels)
    
    if os.path.exists(temp_dataset_dir):
        shutil.rmtree(temp_dataset_dir)
    
    return result

def train_model():
    return _train_model_from_directory(DATASET_DIR)

def _train_model_from_directory_with_labels(dataset_dir, selected_labels):
    global training_status
    training_status["is_training"] = True
    training_status["progress"] = "Preparing training data..."
    
    if not os.path.exists(dataset_dir):
        training_status["is_training"] = False
        return None
        
    total_images = sum([len(glob.glob(os.path.join(dataset_dir, folder, "*")))
                        for folder in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, folder))])

    if total_images < 2:
        training_status["is_training"] = False
        return None

    training_status["progress"] = "Loading training data..."
    datagen = ImageDataGenerator(rescale=1./255, validation_split=TRAINING_CONFIG["validation_split"])
    train_gen = datagen.flow_from_directory(
        dataset_dir, 
        target_size=TRAINING_CONFIG["target_size"], 
        batch_size=TRAINING_CONFIG["batch_size"], 
        class_mode="categorical", 
        subset="training"
    )
    val_gen = datagen.flow_from_directory(
        dataset_dir, 
        target_size=TRAINING_CONFIG["target_size"], 
        batch_size=TRAINING_CONFIG["batch_size"], 
        class_mode="categorical", 
        subset="validation"
    )

    if train_gen.samples == 0 or val_gen.samples == 0:
        training_status["is_training"] = False
        return None

    training_status["progress"] = "Building model architecture..."
    model = _create_model(train_gen.num_classes)

    training_status["progress"] = "Training model..."
    model.fit(train_gen, validation_data=val_gen, epochs=TRAINING_CONFIG["epochs"])
    
    training_status["progress"] = "Saving model..."
    model.save(MODEL_PATH)
    model_id = insert_model("latest_model", MODEL_PATH)
    
    training_status["progress"] = "Moving data to trained tables..."
    _move_data_to_trained_tables(selected_labels, model_id)
    
    training_status["progress"] = "Training completed!"
    training_status["is_training"] = False
    return model

def _train_model_from_directory(dataset_dir):
    if not os.path.exists(dataset_dir):
        return None
        
    total_images = sum([len(glob.glob(os.path.join(dataset_dir, folder, "*")))
                        for folder in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, folder))])

    if total_images < 2:
        return None

    datagen = ImageDataGenerator(rescale=1./255, validation_split=TRAINING_CONFIG["validation_split"])
    train_gen = datagen.flow_from_directory(
        dataset_dir, 
        target_size=TRAINING_CONFIG["target_size"], 
        batch_size=TRAINING_CONFIG["batch_size"], 
        class_mode="categorical", 
        subset="training"
    )
    val_gen = datagen.flow_from_directory(
        dataset_dir, 
        target_size=TRAINING_CONFIG["target_size"], 
        batch_size=TRAINING_CONFIG["batch_size"], 
        class_mode="categorical", 
        subset="validation"
    )

    if train_gen.samples == 0 or val_gen.samples == 0:
        return None

    model = _create_model(train_gen.num_classes)
    model.fit(train_gen, validation_data=val_gen, epochs=TRAINING_CONFIG["epochs"])
    model.save(MODEL_PATH)
    
    insert_model("latest_model", MODEL_PATH)
    return model

def _create_model(num_classes):
    model = Sequential([
        Conv2D(32, (3,3), activation='relu', input_shape=(64,64,3)),
        MaxPooling2D(2,2),
        Flatten(),
        Dense(128, activation='relu'),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    return model

def _move_data_to_trained_tables(selected_labels, model_id):
    try:
        for label in selected_labels:
            cursor.execute("SELECT i.id, i.filename, i.filepath FROM images i JOIN labels l ON i.id = l.image_id WHERE l.label = %s AND i.filepath LIKE %s", (label, '%dataset/train%'))
            rows = cursor.fetchall()
            
            for row in rows:
                image_id, filename, filepath = row
                trained_image_id = insert_trained_image(filename, filepath, model_id)
                insert_trained_label(trained_image_id, label)
                cursor.execute("DELETE FROM labels WHERE image_id = %s", (image_id,))
                cursor.execute("DELETE FROM images WHERE id = %s", (image_id,))
                
        cursor.connection.commit()
    except Exception as e:
        print(f"Error moving data to trained tables: {e}")
        global training_status
        training_status["is_training"] = False
        return None