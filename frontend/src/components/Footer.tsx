import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-green-400 mb-4">Vision ML Classifier</h3>
            <p className="text-gray-300 mb-4">
              Train custom image classification models locally with our FastAPI-powered platform. 
              Upload, label, and classify images with confidence.
            </p>
            <div className="flex space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                TensorFlow 2.x
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                FastAPI
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                React 19
              </span>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Image Upload & Labeling</li>
              <li>CNN Model Training</li>
              <li>Real-time Predictions</li>
              <li>Image Carousel Viewer</li>
              <li>Advanced Search</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/upload" className="text-gray-300 hover:text-green-400 transition-colors">
                  Upload Images
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-gray-300 hover:text-green-400 transition-colors">
                  Make Predictions
                </Link>
              </li>
              <li>
                <Link to="/models" className="text-gray-300 hover:text-green-400 transition-colors">
                  View Models
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-300 hover:text-green-400 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Vision ML Classifier. Built with FastAPI, React & TensorFlow.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Powered by</span>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603L1.292 5.856zm21.416 5.716l-4.095-2.378v9.618L8.459 24V0l10.154 5.856 4.095 2.378v3.338z"/>
              </svg>
              <span className="text-sm font-medium text-gray-300">TensorFlow</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}