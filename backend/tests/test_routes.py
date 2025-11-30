import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_models_endpoint():
    response = client.get("/models")
    assert response.status_code == 200
    assert "status" in response.json()

def test_labels_endpoint():
    response = client.get("/labels")
    assert response.status_code == 200
    assert "status" in response.json()

def test_training_data_endpoint():
    response = client.get("/training-data")
    assert response.status_code == 200
    assert "status" in response.json()

def test_uploaded_data_endpoint():
    response = client.get("/uploaded-data")
    assert response.status_code == 200
    assert "status" in response.json()