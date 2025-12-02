import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import UsersSection from "../components/sections/UsersSection";
import TrainedModelsSection from "../components/sections/TrainedModelsSection";
import StatsSection from "../components/sections/StatsSection";

export default function Home() {
  const [config, setConfig] = useState({
    model: 'CNN',
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adam',
    imageSize: 224
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              AI-Powered
              <span className="block text-green-600">Image Classification</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Train custom CNN models with your own datasets. Upload images, configure parameters, 
              and deploy production-ready classifiers in minutes, not months.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">99.2%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">&lt;5min</div>
              <div className="text-sm text-gray-600">Training Time</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Model Types</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">Real-time</div>
              <div className="text-sm text-gray-600">Predictions</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/upload"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg inline-block"
              >
                Start Classifying
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/docs"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-200 inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Read the Docs</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Configuration UI */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl border border-green-100 p-8"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Model Configuration</h3>
            <p className="text-gray-600">Configure your CNN parameters for optimal performance</p>
          </div>

          <div className="space-y-6">
            {/* Model Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model Architecture</label>
              <select 
                value={config.model}
                onChange={(e) => setConfig({...config, model: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="CNN">Convolutional Neural Network</option>
                <option value="ResNet">ResNet-50</option>
                <option value="VGG">VGG-16</option>
                <option value="MobileNet">MobileNet</option>
              </select>
            </div>

            {/* Epochs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Epochs: {config.epochs}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={config.epochs}
                onChange={(e) => setConfig({...config, epochs: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>100</span>
              </div>
            </div>

            {/* Batch Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
              <div className="grid grid-cols-4 gap-2">
                {[16, 32, 64, 128].map(size => (
                  <button
                    key={size}
                    onClick={() => setConfig({...config, batchSize: size})}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      config.batchSize === size 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Rate</label>
              <select 
                value={config.learningRate}
                onChange={(e) => setConfig({...config, learningRate: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={0.1}>0.1 (High)</option>
                <option value={0.01}>0.01 (Medium)</option>
                <option value={0.001}>0.001 (Low)</option>
                <option value={0.0001}>0.0001 (Very Low)</option>
              </select>
            </div>

            {/* Optimizer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Optimizer</label>
              <div className="grid grid-cols-3 gap-2">
                {['adam', 'sgd', 'rmsprop'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setConfig({...config, optimizer: opt})}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      config.optimizer === opt 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Image Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[128, 224, 512].map(size => (
                  <button
                    key={size}
                    onClick={() => setConfig({...config, imageSize: size})}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      config.imageSize === size 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Deploy Model Configuration
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Additional Sections */}
      <StatsSection />
      <UsersSection />
      <TrainedModelsSection />
    </div>
  );
}