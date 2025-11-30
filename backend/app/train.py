import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
import os

# --- Configuration ---
data_dir = "../dataset/train"  # your dataset folder
model_save_path = "app/models/my_model.pt"
batch_size = 16
epochs = 5
lr = 1e-4
num_classes = 2  # default, will adjust automatically

# --- Ensure dataset exists ---
if not os.path.exists(data_dir):
    print(f"Dataset directory not found: {data_dir}")
    print("Create folder structure: dataset/train/<class_name>/image.jpg")
    print("Skipping training...")
    exit(0)

# --- Transforms ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# --- Dataset ---
train_dataset = datasets.ImageFolder(data_dir, transform=transform)

if len(train_dataset) == 0:
    print("No images found in dataset. Skipping training...")
    exit(0)

num_classes = len(train_dataset.classes)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

# --- Model ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
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
