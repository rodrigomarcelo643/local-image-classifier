import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
import os
import glob

# --- Configuration ---
data_dir = "../dataset/train"  # dataset folder with label subfolders
model_save_path = "app/models/my_model.pt"
batch_size = 16
epochs = 5
lr = 1e-4

# --- Ensure dataset exists ---
if not os.path.exists(data_dir):
    print(f"Dataset directory not found: {data_dir}")
    print("Create folder structure: dataset/train/<label>/image.jpg")
    exit(0)

# --- Automatically find classes (folders) ---
classes = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
if not classes:
    print("No label folders found in dataset/train")
    exit(0)

# --- Check for empty folders ---
valid_classes = []
for c in classes:
    imgs = glob.glob(os.path.join(data_dir, c, "*"))
    if len(imgs) > 0:
        valid_classes.append(c)
    else:
        print(f"Skipping empty class folder: {c}")

if not valid_classes:
    print("No images found in any class folder. Exiting...")
    exit(0)

print(f"Detected classes: {valid_classes}")

# --- Transforms ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# --- Dataset ---
train_dataset = datasets.ImageFolder(data_dir, transform=transform)
print("Mapping of classes to indices:", train_dataset.class_to_idx)

num_classes = len(train_dataset.classes)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

# --- Device ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Model ---
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, num_classes)
model = model.to(device)

# --- Loss and optimizer ---
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=lr)

# --- Training loop ---
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    for imgs, labels in train_loader:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss: {running_loss/len(train_loader):.4f}")

# --- Save model ---
os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
torch.save(model.state_dict(), model_save_path)
print("Model saved to", model_save_path)
