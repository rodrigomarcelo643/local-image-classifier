# Local Image Classifier

![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)

A FastAPI-based web application for uploading images, labeling them, and training a local Convolutional Neural Network (CNN) for image classification. Features include automatic label creation from uploaded images, database integration with MySQL, and a React frontend for seamless image uploads and predictions.

## 🚀 Features

- **Image Upload & Labeling**: Upload images with automatic or manual labeling
- **CNN Model Training**: Train custom image classification models locally
- **Real-time Predictions**: Test trained models with new images
- **Training Progress Tracking**: Monitor model training status in real-time
- **Image Matching System**: Compare predictions with training data
- **Database Integration**: MySQL database for storing images, labels, and models
- **Modern UI**: React frontend with TypeScript and Tailwind CSS
- **RESTful API**: FastAPI backend with automatic documentation

## 📁 Project Structure

```
local-image-classifier/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── db.py                # Database operations
│   │   ├── predict.py           # Model prediction logic
│   │   ├── train.py             # Model training logic
│   │   ├── image_matcher.py     # Image matching system
│   │   └── utils.py             # Utility functions
│   ├── dataset/
│   │   └── train/               # Training images directory
│   ├── model/                   # Trained models storage
│   ├── uploads/                 # Temporary uploads
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.tsx   # Image upload component
│   │   │   ├── PredictForm.tsx  # Model testing component
│   │   │   ├── ModelsList.tsx   # Training data management
│   │   │   └── Navbar.tsx       # Navigation component
│   │   ├── pages/
│   │   │   └── Home.tsx         # Home page
│   │   ├── utils/
│   │   │   └── toast.ts         # Toast notifications
│   │   ├── App.tsx              # Main React application
│   │   └── main.tsx             # React entry point
│   ├── package.json             # Node.js dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   ├── vite.config.ts           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS configuration
├── trained_data_table.sql       # Database schema
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd automation-microservice-image-recognition
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Set up MySQL database**
   ```sql
   CREATE DATABASE image_recognition;
   -- Run the SQL commands from trained_data_table.sql
   ```

6. **Start the FastAPI server**
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Configuration

Create the required tables using the provided SQL schema:

```sql
-- Run the commands from trained_data_table.sql
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE labels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_id INT,
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Additional tables for trained data...
```

## 🚀 Usage

1. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

2. **Upload Training Images**
   - Navigate to the Upload page
   - Drag and drop images or click to browse
   - Add labels for your images
   - Upload to build your training dataset

3. **Train the Model**
   - Go to the Models page
   - Select labels to include in training
   - Click "Train Model" to start training
   - Monitor training progress in real-time

4. **Test Predictions**
   - Navigate to the Predict page
   - Upload a test image
   - View prediction results with confidence scores
   - See matched training examples

## 🔧 Configuration

### Environment Variables (.env)

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=image_recognition
```

### API Endpoints

- `POST /upload` - Upload training images
- `POST /predict` - Make predictions
- `POST /predict-with-match` - Predict with training data matching
- `POST /train` - Start model training
- `GET /models` - List trained models
- `GET /training-status` - Get training progress
- `GET /labels` - Get available labels
- `GET /training-data` - Get training dataset info

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in .env file
   - Ensure database exists

2. **Model Training Fails**
   - Check if training images exist in dataset/train/
   - Verify sufficient training data (minimum 2 images per class)
   - Check Python dependencies are installed

3. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## 📊 Tech Stack

- **Backend**: FastAPI, Python, TensorFlow, MySQL
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Database**: MySQL
- **ML Framework**: TensorFlow/Keras
- **Image Processing**: PIL, OpenCV
- **API Documentation**: Swagger/OpenAPI