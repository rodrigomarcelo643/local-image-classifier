import os

# Environment settings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Directory paths
UPLOAD_DIR = "uploads"
DATASET_DIR = "dataset/train"
MODEL_PATH = "model/latest_model.h5"

# Create directories
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# Training configuration
TRAINING_CONFIG = {
    "target_size": (64, 64),
    "batch_size": 32,
    "epochs": 5,
    "validation_split": 0.2
}