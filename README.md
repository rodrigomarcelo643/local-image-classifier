# Local Vision ML Image Classifier

![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)

A FastAPI-based web application for uploading images, labeling them, and training a local Convolutional Neural Network (CNN) for image classification. Features include automatic label creation from uploaded images, database integration with MySQL, and a React frontend for seamless image uploads and predictions.

## 🚀 Features

### **Core ML Capabilities**

- **Image Upload & Labeling**: Drag-and-drop interface with automatic or manual labeling
- **CNN Model Training**: Train custom image classification models locally with real-time progress
- **Smart Predictions**: Test models with confidence scores and similarity matching
- **Image Carousel Viewer**: Browse training images with single/multi-image modal display
- **Advanced Search & Filtering**: Search models by name, path, classes, or status

### **User Experience**

- **Authentication System**: User login/signup with profile management and avatar support
- **Interactive Documentation**: Built-in API documentation with responsive sidebar navigation
- **Real-time Status**: Live training progress tracking with polling updates
- **Toast Notifications**: Comprehensive feedback system with close controls
- **Responsive Design**: Mobile-friendly interface with skeleton loading states

### **Technical Architecture**

- **Modular Backend**: Clean separation of concerns with services and routes
- **Database Integration**: MySQL with trained/uploaded data management
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Modern Frontend**: React 19 with TypeScript, Tailwind CSS, and Framer Motion

## 📁 Project Structure

```
local-vision-ml-image-classifier/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app setup (22 lines)
│   │   ├── config.py            # Centralized configuration
│   │   ├── db.py                # Database operations
│   │   ├── predict.py           # Model prediction logic
│   │   ├── image_matcher.py     # Image matching system
│   │   ├── services/            # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── file_service.py  # File handling operations
│   │   │   └── training_service.py # ML training logic
│   │   └── routes/              # API endpoint modules
│   │       ├── __init__.py
│   │       ├── upload_routes.py # Image upload endpoints
│   │       ├── prediction_routes.py # Inference endpoints
│   │       ├── training_routes.py # Training management
│   │       └── data_routes.py   # Data retrieval endpoints
│   ├── dataset/
│   │   └── train/               # Training images directory
│   ├── model/                   # Trained models storage
│   ├── uploads/                 # Temporary uploads
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Backend Docker configuration
│   ├── .env                     # Environment variables
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.tsx   # Image upload with preview
│   │   │   ├── PredictForm.tsx  # Model testing component
│   │   │   ├── ModelsList.tsx   # Advanced model management
│   │   │   ├── Navbar.tsx       # Navigation component
│   │   │   ├── LoginForm.tsx    # User authentication
│   │   │   ├── SignupForm.tsx   # User registration
│   │   │   ├── UserAvatar.tsx   # Profile dropdown
│   │   │   ├── ProfilePage.tsx  # User profile management
│   │   │   ├── SettingsPage.tsx # Application settings
│   │   │   └── SkeletonLoader.tsx # Loading states
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Animated landing page
│   │   │   └── Documentation.tsx # API documentation
│   │   ├── utils/
│   │   │   └── toast.ts         # Enhanced toast system
│   │   ├── App.tsx              # Main React application
│   │   └── main.tsx             # React entry point
│   ├── package.json             # Node.js dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── Dockerfile               # Frontend Docker configuration
│   └── .gitignore
├── docker-compose.yml           # Docker Compose configuration
├── .prettierrc                  # Prettier configuration
├── .editorconfig                # Editor configuration
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

### **Quick Start**

1. **Access the application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8001
   - Interactive Docs: http://localhost:8001/docs

2. **User Authentication** (Optional)
   - Sign up or login with demo credentials: `user` / `user123`
   - Access profile settings and personalized experience

### **Core Workflow**

3. **Upload Training Images**

   - Navigate to Upload page or use "Start Classifying" button
   - Drag and drop images or click to browse
   - Add labels for your images (auto-generated from filename)
   - Preview images before upload

4. **Manage Training Data**

   - Go to Models page to view uploaded and trained data
   - Click eye icon or image thumbnails to view full image carousel
   - Use search and filters to find specific models
   - Select labels for training with visual preview

5. **Train Custom Models**

   - Click "Train New Model" and select desired labels
   - Monitor real-time training progress with status updates
   - View training completion notifications

6. **Test & Predict**
   - Navigate to Predict page
   - Upload test images with drag-and-drop
   - View predictions with confidence scores
   - See similar training images with similarity matching

### **Advanced Features**

7. **Documentation & API**
   - Access built-in documentation via "Read the Docs" button
   - Browse comprehensive API reference with code examples
   - Test endpoints directly from the interactive documentation

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

## 🐳 Docker Setup

### Quick Start with Docker

```bash
# Clone and start all services
git clone <repository-url>
cd automation-microservice-image-recognition
docker-compose up --build
```

### Individual Services

```bash
# Backend only
docker-compose up backend mysql

# Frontend only
docker-compose up frontend
```

## 📊 Tech Stack

### **Backend Architecture**

- **Framework**: FastAPI with modular route structure
- **Language**: Python 3.8+ with type hints
- **ML Framework**: TensorFlow 2.x / Keras for CNN training
- **Database**: MySQL 8.0+ with connection pooling
- **Image Processing**: PIL, OpenCV for preprocessing
- **Architecture**: Clean separation with services and routes

### **Frontend Stack**

- **Framework**: React 19 with TypeScript 5.9+
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite for fast development
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React hooks with localStorage persistence
- **UI Components**: Custom skeleton loaders and modals

### **Development & DevOps**

- **API Documentation**: Swagger/OpenAPI with interactive docs
- **Containerization**: Docker with multi-stage builds
- **Code Quality**: Prettier, EditorConfig, TypeScript strict mode
- **CI/CD**: GitHub Actions for automated testing
- **Authentication**: JWT-based user management
- **Real-time Updates**: WebSocket-like polling for training status
