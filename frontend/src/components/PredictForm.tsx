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
import { API_BASE_URL } from "../config/api";

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
  const [trainingData, setTrainingData] = useState<unknown[]>([]);
  const [uploadedData, setUploadedData] = useState<unknown[]>([]);
  const [hasTrainedModel, setHasTrainedModel] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLabels();
    fetchTrainingData();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/labels`);
      setAvailableLabels(response.data.labels || []);
    } catch (err) {
      console.error('Failed to fetch labels:', err);
    }
  };

  const fetchTrainingData = async () => {
    try {
      setDataLoading(true);
      const [trainingRes, uploadedRes, modelsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/training-data`),
        axios.get(`${API_BASE_URL}/uploaded-data`),
        axios.get(`${API_BASE_URL}/models`)
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
        `${API_BASE_URL}/predict-with-match`,
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      closeToast(loadingToastId);
      genericToasts.success('Image classified successfully!');
      setResult(response.data);
      
    } catch (err: unknown) {
      console.error(err);
      closeToast(loadingToastId);
      
      const error = err as { code?: string; response?: { data?: { message?: string } }; request?: unknown };
      
      if (error.code === 'ECONNABORTED') {
        genericToasts.error('Request timeout. Please try again.');
      } else if (error.response) {
        genericToasts.error(`Prediction failed: ${error.response.data?.message || 'Server error'}`);
      } else if (error.request) {
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
                  </div>
                  <div className="text-lg text-gray-600">
                    Confidence: <span className="font-semibold text-blue-600">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                {/* Matched Training Images */}
                {result.matched_training_images && result.matched_training_images.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-3">Matched Training Images</h5>
                    <div className="grid grid-cols-3 gap-3">
                      {result.matched_training_images.map((img, index) => (
                        <div key={index} className="text-center">
                          <img 
                            src={`${API_BASE_URL}/static/train/${result.prediction}/${img.filename}`}
                            alt={`${result.prediction} example ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-green-400 shadow-md"
                          />
                          <p className="text-xs text-green-700 mt-1 font-medium truncate">{img.filename}</p>
                        </div>
                      ))}
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