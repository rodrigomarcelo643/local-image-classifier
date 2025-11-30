import torch
import os
from torchvision import models, transforms
import torch.nn as nn
from PIL import Image

# Paths
MODEL_PATH = "app/models/my_model.pt"
CLASSES_PATH = "app/models/classes.txt"  # optional file to store class names
NUM_CLASSES = 2  # default fallback

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load class names if available
if os.path.exists(CLASSES_PATH):
    with open(CLASSES_PATH, "r") as f:
        classes = [line.strip() for line in f.readlines()]
    NUM_CLASSES = len(classes)
else:
    classes = [str(i) for i in range(NUM_CLASSES)]

# --- Model setup ---
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, NUM_CLASSES)
model = model.to(device)
model.eval()

# Load model state
if os.path.exists(MODEL_PATH):
    try:
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Model file not found, using untrained model")

# --- Prediction function ---
def predict(image_path: str):
    """
    Predicts the class and confidence for an image.

    Args:
        image_path (str): Path to the image

    Returns:
        tuple: (predicted_label (str), confidence (float))
    """
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],  # ImageNet normalization
            std=[0.229, 0.224, 0.225]
        )
    ])

    # Open image
    img = Image.open(image_path).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted_class = torch.max(probs, 1)

    label_name = classes[predicted_class.item()] if classes else str(predicted_class.item())
    return label_name, confidence.item()
