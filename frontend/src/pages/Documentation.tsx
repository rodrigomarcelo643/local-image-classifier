import { useState } from "react";
import { motion } from "framer-motion";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", title: "Introduction", icon: "📖" },
      { id: "installation", title: "Installation", icon: "⚙️" },
      { id: "quick-start", title: "Quick Start", icon: "🚀" },
      { id: "configuration", title: "Configuration", icon: "🔧" }
    ]
  },
  {
    title: "API Reference",
    items: [
      { id: "authentication", title: "Authentication", icon: "🔐" },
      { id: "upload-api", title: "Upload API", icon: "📤" },
      { id: "prediction-api", title: "Prediction API", icon: "🤖" },
      { id: "models-api", title: "Models API", icon: "🧠" },
      { id: "training-api", title: "Training API", icon: "🎯" }
    ]
  },
  {
    title: "Integration",
    items: [
      { id: "javascript", title: "JavaScript SDK", icon: "🟨" },
      { id: "python", title: "Python SDK", icon: "🐍" },
      { id: "curl", title: "cURL Examples", icon: "💻" },
      { id: "webhooks", title: "Webhooks", icon: "🔗" }
    ]
  },
  {
    title: "Advanced",
    items: [
      { id: "batch-processing", title: "Batch Processing", icon: "📊" },
      { id: "custom-models", title: "Custom Models", icon: "🎨" },
      { id: "performance", title: "Performance Tips", icon: "⚡" },
      { id: "troubleshooting", title: "Troubleshooting", icon: "🔍" }
    ]
  }
];

const content = {
  introduction: {
    title: "Introduction",
    content: `
# Welcome to Vision ML API

The Vision ML Image Classification API provides powerful machine learning capabilities for image recognition and classification. Built with FastAPI and TensorFlow, it offers a robust solution for training custom models and making predictions.

## Key Features

- **Custom Model Training**: Train your own CNN models with labeled images
- **Real-time Predictions**: Fast image classification with confidence scores
- **Batch Processing**: Handle multiple images efficiently
- **RESTful API**: Easy integration with any programming language
- **Web Interface**: User-friendly dashboard for model management

## Use Cases

- **E-commerce**: Product categorization and visual search
- **Healthcare**: Medical image analysis and diagnosis
- **Security**: Object detection and surveillance
- **Agriculture**: Crop monitoring and disease detection
- **Manufacturing**: Quality control and defect detection
    `
  },
  installation: {
    title: "Installation",
    content: `
# Installation Guide

## Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

## Backend Setup

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd automation-microservice-image-recognition

# Set up Python virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up MySQL database
mysql -u root -p
CREATE DATABASE image_recognition;
# Run the SQL commands from trained_data_table.sql

# Start the FastAPI server
uvicorn app.main:app --reload --port 8001
\`\`\`

## Frontend Setup

\`\`\`bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
\`\`\`

## Docker Setup (Alternative)

\`\`\`bash
# Quick start with Docker
docker-compose up --build
\`\`\`
    `
  },
  "quick-start": {
    title: "Quick Start",
    content: `
# Quick Start Guide

## 1. Upload Training Images

\`\`\`bash
curl -X POST "http://localhost:8001/upload" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@path/to/image.jpg" \\
  -F "label=cat"
\`\`\`

## 2. Train a Model

\`\`\`bash
curl -X POST "http://localhost:8001/train" \\
  -H "Content-Type: application/json" \\
  -d '{"labels": ["cat", "dog", "bird"]}'
\`\`\`

## 3. Make Predictions

\`\`\`bash
curl -X POST "http://localhost:8001/predict" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@path/to/test_image.jpg"
\`\`\`

## Response Example

\`\`\`json
{
  "status": true,
  "prediction": "cat",
  "confidence": 0.95,
  "matched_training_images": [
    {
      "filename": "cat_001.jpg",
      "similarity_score": 0.92
    }
  ]
}
\`\`\`
    `
  }
};

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = (sectionId: string) => {
    const section = content[sectionId as keyof typeof content];
    if (!section) return <div>Content not found</div>;

    return (
      <div className="prose prose-lg max-w-none">
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ 
            __html: section.content
              .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
              .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
              .replace(/^# (.+)$/gm, '<h1>$1</h1>')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/^\- (.+)$/gm, '<li>$1</li>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(?!<[h|l|p|d])(.+)$/gm, '<p>$1</p>')
          }}
        />
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <h2 className="text-xl font-bold">Documentation</h2>
          <p className="text-sm opacity-90 mt-1">Vision ML API Guide</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {sidebarItems.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all duration-200 flex items-center space-x-3 group ${
                        activeSection === item.id
                          ? "bg-green-100 text-green-700 font-semibold shadow-sm border-l-4 border-green-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-green-600 hover:shadow-sm"
                      }`}
                    >
                      <span className="text-lg transition-transform group-hover:scale-110">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto border-r border-gray-200"
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <h2 className="text-xl font-bold">Documentation</h2>
            <p className="text-sm opacity-90 mt-1">Vision ML API Guide</p>
          </div>

          <nav className="p-4">
            {sidebarItems.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all duration-200 flex items-center space-x-3 group ${
                          activeSection === item.id
                            ? "bg-green-100 text-green-700 font-semibold shadow-sm border-l-4 border-green-500"
                            : "text-gray-700 hover:bg-gray-50 hover:text-green-600 hover:shadow-sm"
                        }`}
                      >
                        <span className="text-lg transition-transform group-hover:scale-110">{item.icon}</span>
                        <span className="font-medium">{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-800 lg:ml-0 ml-12">
            {content[activeSection as keyof typeof content]?.title || "Documentation"}
          </h1>
        </header>

        {/* Content */}
        <main className="p-6 max-w-4xl mx-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent(activeSection)}
          </motion.div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .markdown-content h1 {
            font-size: 2rem;
            font-weight: bold;
            margin: 2rem 0 1rem 0;
            color: #1f2937;
          }
          .markdown-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem 0;
            color: #374151;
          }
          .markdown-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
            color: #4b5563;
          }
          .markdown-content p {
            margin: 1rem 0;
            line-height: 1.6;
            color: #6b7280;
          }
          .markdown-content pre {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          .markdown-content code {
            background: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.875rem;
          }
          .markdown-content .inline-code {
            background: #f3f4f6;
            color: #dc2626;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
          }
          .markdown-content li {
            margin: 0.5rem 0;
            padding-left: 1rem;
            position: relative;
          }
          .markdown-content li:before {
            content: "•";
            color: #10b981;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
        `
      }} />
    </div>
  );
}