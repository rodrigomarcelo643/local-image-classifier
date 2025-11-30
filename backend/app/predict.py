import torch
import os
from torchvision import models
import torch.nn as nn
from PIL import Image
from torchvision import transforms

model_path = "app/models/my_model.pt"
num_classes = 2  # default

# --- Device ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Model setup ---
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, num_classes)
model = model.to(device)
model.eval()

# --- Load model safely ---
if os.path.exists(model_path):
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Model file not found, using untrained model")

# --- Prediction function ---
def predict(image_path: str):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    img = Image.open(image_path).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted_class = torch.max(probs, 1)

    # If classes are unknown, return class index
    return str(predicted_class.item()), confidence.item()
