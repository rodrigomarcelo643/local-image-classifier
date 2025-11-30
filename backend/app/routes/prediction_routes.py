from fastapi import APIRouter, UploadFile, File
from ..services.file_service import save_temp_file
from ..predict import predict
from ..image_matcher import image_matcher
from ..db import insert_image, insert_label

router = APIRouter()

@router.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    file_path = save_temp_file(file)
    label, confidence = predict(file_path)
    image_id = insert_image(file.filename, file_path)
    insert_label(image_id, label)
    return {"status": True, "prediction": label, "confidence": confidence}

@router.post("/predict-with-match")
async def predict_with_match(file: UploadFile = File(...)):
    file_path = save_temp_file(file)
    label, confidence = predict(file_path)
    
    matched_images = image_matcher.find_comprehensive_matches(file_path, label, top_k=3)
    
    formatted_matches = [{
        "filename": match["filename"],
        "filepath": match["filepath"],
        "similarity_score": match["combined_similarity"],
        "feature_similarity": match["feature_similarity"],
        "color_similarity": match["color_similarity"]
    } for match in matched_images]

    return {
        "status": True, 
        "prediction": label, 
        "confidence": confidence,
        "matched_training_images": formatted_matches
    }