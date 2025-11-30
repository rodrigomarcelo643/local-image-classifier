import pytest
from app.config import Config

# test config paths 
def test_config_paths():
    assert hasattr(Config, 'UPLOAD_DIR')
    assert hasattr(Config, 'DATASET_DIR')
    assert hasattr(Config, 'MODEL_DIR')
# test config paths training 
def test_config_training():
    assert hasattr(Config, 'EPOCHS')
    assert hasattr(Config, 'BATCH_SIZE')
    assert Config.EPOCHS > 0
    assert Config.BATCH_SIZE > 0