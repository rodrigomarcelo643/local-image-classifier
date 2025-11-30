import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { 
  fileToasts, 
  showLoading, 
  closeToast,
  genericToasts 
} from "../utils/toast";
import SkeletonLoader from "./SkeletonLoader";

interface PredictResponse {
  status: boolean;
  prediction: string;
  confidence: number;
  matched_training_images?: SampleImage[];
}

interface SampleImage {
  filename: string;
  filepath: string;
}

export default function PredictForm() {
  const [file, setFile] = useState<File | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [sampleImages, setSampleImages] = useState<SampleImage[]>([]);
  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [hasTrainedModel, setHasTrainedModel] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLabels();
    fetchTrainingData();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await axios.get('http://localhost:8001/labels');
      setAvailableLabels(response.data.labels || []);
    } catch (err) {
      console.error('Failed to fetch labels:', err);
    }
  };

  const fetchTrainingData = async () => {
    try {
      setDataLoading(true);
      const [trainingRes, uploadedRes, modelsRes] = await Promise.all([
        axios.get('http://localhost:8001/training-data'),
        axios.get('http://localhost:8001/uploaded-data'),
        axios.get('http://localhost:8001/models')
      ]);
      
      setTrainingData(trainingRes.data.training_data || []);
      setUploadedData(uploadedRes.data.uploaded_data || []);
      setHasTrainedModel((modelsRes.data.models || []).length > 0);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchSampleImages = async (label: string) => {
    try {
      // Try to get training images first (from trained data)
      const response = await axios.get(`http://localhost:8001/training-images/${encodeURIComponent(label)}`);
      if (response.data.images && response.data.images.length > 0) {
        setSampleImages(response.data.images || []);
      } else {
        // Fallback to sample images if no training images found
        const fallbackResponse = await axios.get(`http://localhost:8001/sample-images/${encodeURIComponent(label)}`);
        setSampleImages(fallbackResponse.data.images || []);
      }
    } catch (err) {
      console.error('Failed to fetch sample images:', err);
      setSampleImages([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.type.startsWith('image/')) {
        fileToasts.invalidType();
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        fileToasts.tooLarge(10);
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        if (droppedFile.size > 10 * 1024 * 1024) {
          fileToasts.tooLarge(10);
          return;
        }
        setFile(droppedFile);
        setResult(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        fileToasts.invalidType();
      }
    }
  };

  const handlePredict = async () => {
    if (!file) {
      fileToasts.noFile();
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    let loadingToastId: string | undefined;

    try {
      setPredicting(true);
      loadingToastId = showLoading('Classifying image...');
      
      const response: AxiosResponse<PredictResponse> = await axios.post(
        "http://localhost:8001/predict-with-match",
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      closeToast(loadingToastId);
      genericToasts.success('Image classified successfully!');
      setResult(response.data);
      
      // No need to set sampleImages since we're using matched_training_images directly
    } catch (err: any) {
      console.error(err);
      closeToast(loadingToastId);
      
      if (err.code === 'ECONNABORTED') {
        genericToasts.error('Request timeout. Please try again.');
      } else if (err.response) {
        genericToasts.error(`Prediction failed: ${err.response.data?.message || 'Server error'}`);
      } else if (err.request) {
        genericToasts.error('Network error. Please check if the backend server is running.');
      } else {
        genericToasts.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setPredicting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setSampleImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Test Model Classification</h2>
          <p className="opacity-90">Upload an image to test your trained model</p>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {/* File Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${
              dragActive 
                ? "border-green-500 bg-green-50" 
                : file 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div>
                  <p className="text-green-600 font-semibold mb-2">Selected: {file?.name}</p>
                  <p className="text-sm text-gray-500">Click or drag to change image</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-2 text-gray-700">Choose an image to classify</p>
                <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, WebP (Max 10MB)</p>
              </div>
            )}
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={!file || predicting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
              !file || predicting
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            }`}
          >
            {predicting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Classifying...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Classify Image
              </div>
            )}
          </button>



          {/* Prediction Result */}
          {result && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Classification Result
              </h4>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    availableLabels.includes(result.prediction) 
                      ? 'text-green-700' 
                      : 'text-blue-700'
                  }`}>
                    {result.prediction}
                    {availableLabels.includes(result.prediction) && (
                      <span className="ml-2 text-green-600">
                        <svg className="w-6 h-6 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="text-lg text-gray-600">
                    Confidence: <span className="font-semibold text-blue-600">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {result.confidence >= 0.95 && availableLabels.includes(result.prediction) ? (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 font-bold mb-1">
                        🎯 Perfect Match - Excellent confidence!
                      </div>
                      <div className="text-xs text-green-700">
                        The model is extremely confident this is "{result.prediction}". Features match training data perfectly.
                      </div>
                    </div>
                  ) : result.confidence >= 0.6 && availableLabels.includes(result.prediction) ? (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 font-medium mb-1">
                        ✓ High confidence match with training data
                      </div>
                      <div className="text-xs text-green-700">
                        Strong recognition of "{result.prediction}" characteristics. Model is confident in this classification.
                      </div>
                    </div>
                  ) : result.confidence >= 0.6 && availableLabels.includes(result.prediction) ? (
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-sm text-yellow-600 font-medium mb-1">
                        ⚠ Moderate confidence - acceptable match
                      </div>
                      <div className="text-xs text-yellow-700">
                        Model recognizes some "{result.prediction}" features but with moderate confidence. Consider adding more training examples.
                      </div>
                    </div>
                  ) : availableLabels.includes(result.prediction) ? (
                    <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-600 font-medium mb-1">
                        ⚠ Low confidence - uncertain match
                      </div>
                      <div className="text-xs text-orange-700">
                        Model suggests "{result.prediction}" but with low confidence. More training data needed for this category.
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm text-red-600 font-medium mb-1">
                        ❌ Unknown label - not in training data
                      </div>
                      <div className="text-xs text-red-700">
                        "{result.prediction}" was not found in the training data. Consider adding labeled examples for this category.
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      result.confidence >= 0.95 && availableLabels.includes(result.prediction)
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg'
                        : result.confidence >= 0.8 && availableLabels.includes(result.prediction)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : availableLabels.includes(result.prediction)
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                
                {/* Data Reference - Show trained data if available, otherwise uploaded data */}
                {availableLabels.includes(result.prediction) && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {hasTrainedModel && trainingData.length > 0 
                        ? `Trained Categories (${trainingData.length})` 
                        : `Uploaded Categories (${uploadedData.length})`}
                      {hasTrainedModel && trainingData.length > 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Model Trained
                        </span>
                      )}
                    </h4>
                    {dataLoading ? (
                      <SkeletonLoader variant="grid" count={4} />
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {(hasTrainedModel && trainingData.length > 0 ? trainingData : uploadedData).map((data, index) => (
                          <div key={index} className={`rounded-lg p-3 border text-center ${
                            data.label === result.prediction 
                              ? 'bg-green-100 border-green-300' 
                              : 'bg-white border-gray-200'
                          }`}>
                            <div className="mb-2 relative">
                              {data.sample_files.length > 0 && (
                                <img 
                                  src={`http://localhost:8001/static/train/${data.label}/${data.sample_files[0]}`}
                                  alt={`${data.label} sample`}
                                  className="w-12 h-12 object-cover rounded mx-auto border border-gray-300"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxOFYyNk0yNCAzMEgyNk0yNiAxOEgyNE0yNCAxOEgyMk0yMiAxOFYxOC4wMU0yMiAyNlYyNk0yMiAzMEgyMi4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                  }}
                                />
                              )}
                              {data.label === result.prediction && (
                                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                  ✓
                                </div>
                              )}
                            </div>
                            <p className={`text-xs font-medium truncate ${
                              data.label === result.prediction ? 'text-green-800' : 'text-gray-800'
                            }`}>{data.label}</p>
                            <p className={`text-xs ${
                              data.label === result.prediction ? 'text-green-600' : 'text-gray-500'
                            }`}>{data.count} images</p>
                            {data.label === result.prediction && (
                              <div className="mt-1 text-xs bg-green-200 text-green-800 px-1 py-0.5 rounded">
                                MATCHED
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {!hasTrainedModel && uploadedData.length > 0 && (
                      <div className="mt-3 text-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        ⚠ These are uploaded images. Train a model to get predictions based on this data.
                      </div>
                    )}
                  </div>
                )}
                
                {/* Perfect Match Comparison */}
                {result.confidence >= 0.95 && result.matched_training_images && result.matched_training_images.length > 0 && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                    <h5 className="font-bold text-green-800 mb-4 text-center flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      🎯 PERFECT MATCH - {(result.confidence * 100).toFixed(1)}% Confidence
                    </h5>
                    
                    {/* Match Analysis */}
                    <div className="mb-4 p-4 bg-white rounded-lg border border-green-200">
                      <h6 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Match Analysis
                      </h6>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Predicted Label:</span> "{result.prediction}"</p>
                        <p><span className="font-medium">Confidence Score:</span> {(result.confidence * 100).toFixed(2)}%</p>
                        <p><span className="font-medium">Match Quality:</span> <span className="text-green-600 font-semibold">Excellent - Perfect Recognition</span></p>
                        <p><span className="font-medium">Training Data:</span> Found in model's training set</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Your Image */}
                      <div className="text-center">
                        <h6 className="font-semibold text-gray-700 mb-2">Your Image</h6>
                        <div className="relative">
                          <img 
                            src={imagePreview || ''}
                            alt="Your uploaded image"
                            className="w-full h-32 object-cover rounded-lg border-2 border-blue-400 shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            📤
                          </div>
                        </div>
                        <p className="text-sm text-blue-600 mt-2 font-medium">Uploaded for Testing</p>
                      </div>
                      
                      {/* Matched Training Image */}
                      <div className="text-center">
                        <h6 className="font-semibold text-gray-700 mb-2">Matched Training Image</h6>
                        <div className="relative">
                          <img 
                            src={`http://localhost:8001/static/train/${result.prediction}/${result.matched_training_images[0].filename}`}
                            alt={`Training image for ${result.prediction}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-green-400 shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            ✓
                          </div>
                        </div>
                        <p className="text-sm text-green-600 mt-2 font-medium">Label: "{result.prediction}"</p>
                        <p className="text-xs text-gray-500 mt-1">File: {result.matched_training_images[0].filename}</p>
                        <div className="mt-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                          Training Example #1
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                        <span className="text-2xl mr-2">🎉</span>
                        <span className="font-bold text-green-800">Excellent Match! Model is working perfectly.</span>
                      </div>
                      <p className="text-sm text-green-700 mt-2">
                        Your image closely matches the "{result.prediction}" training examples. The model is highly confident in this classification.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* High Confidence Match - Show Training Examples */}
                {result.confidence >= 0.6 && result.confidence < 0.95 && result.matched_training_images && result.matched_training_images.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      High Confidence Match - Training Examples for "{result.prediction}"
                    </h5>
                    
                    {/* Match Analysis */}
                    <div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Confidence Score:</span> {(result.confidence * 100).toFixed(2)}%</p>
                        <p><span className="font-medium">Match Quality:</span> <span className="text-green-600 font-semibold">Good - Strong Recognition</span></p>
                        <p className="text-green-600">✓ Your image shows strong similarity to "{result.prediction}" training examples.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {result.matched_training_images.map((img, index) => (
                        <div key={index} className="text-center">
                          <div className="relative">
                            <img 
                              src={`http://localhost:8001/static/train/${result.prediction}/${img.filename}`}
                              alt={`${result.prediction} example ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-green-400 shadow-md"
                            />
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-xs text-green-700 mt-1 font-medium truncate">{img.filename}</p>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="bg-green-100 px-1 py-0.5 rounded text-green-700">
                              {result.prediction} #{index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-center text-sm text-green-600 font-medium">
                      ✓ {(result.confidence * 100).toFixed(1)}% confidence - Strong match with training data
                      <p className="text-xs text-gray-600 mt-1">
                        The model recognizes key features that match the "{result.prediction}" category.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Low Confidence Match - Show Training Examples */}
                {result.confidence < 0.6 && result.matched_training_images && result.matched_training_images.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Low Confidence Match - Training Examples for "{result.prediction}"
                    </h5>
                    
                    {/* Match Analysis */}
                    <div className="mb-4 p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Confidence Score:</span> {(result.confidence * 100).toFixed(2)}%</p>
                        <p><span className="font-medium">Match Quality:</span> <span className="text-yellow-600 font-semibold">Low - Uncertain Recognition</span></p>
                        <p className="text-yellow-600">⚠ Your image has some similarity to "{result.prediction}" but the model is not confident.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {result.matched_training_images.map((img, index) => (
                        <div key={index} className="text-center">
                          <div className="relative">
                            <img 
                              src={`http://localhost:8001/static/train/${result.prediction}/${img.filename}`}
                              alt={`${result.prediction} example ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-yellow-400 shadow-md"
                            />
                            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-xs text-yellow-700 mt-1 font-medium truncate">{img.filename}</p>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="bg-yellow-100 px-1 py-0.5 rounded text-yellow-700">
                              {result.prediction} #{index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-center text-sm text-yellow-600 font-medium">
                      ⚠ {(result.confidence * 100).toFixed(1)}% confidence - Consider adding more training data
                      <p className="text-xs text-gray-600 mt-1">
                        The model found some similarities but needs more examples to be confident.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Upload an image to test how well your trained model can classify it.</p>
      </div>
    </div>

    {/* Loading Modal */}
    {predicting && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Classifying Image</h3>
          <p className="text-gray-600 mb-4">AI is analyzing your image...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}