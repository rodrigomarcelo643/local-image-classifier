from fastapi import APIRouter, BackgroundTasks
from ..services.training_service import train_model_with_labels, train_model, get_training_status

router = APIRouter()

@router.post("/train")
async def train_model_endpoint(background_tasks: BackgroundTasks, labels: list = None):
    if labels:
        background_tasks.add_task(train_model_with_labels, labels)
        return {"status": True, "message": f"Model training started with {len(labels)} selected labels"}
    else:
        background_tasks.add_task(train_model)
        return {"status": True, "message": "Model training started with all available data"}

@router.get("/training-status")
async def get_training_status_endpoint():
    return get_training_status()