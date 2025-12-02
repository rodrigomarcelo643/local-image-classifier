import { useState, useRef } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { 
  fileToasts, 
  showLoading, 
  closeToast,
  genericToasts 
} from "../utils/toast";
import { API_BASE_URL } from "../config/api";

interface UploadResponse {
  status: boolean;
  image_id: number;
  filename: string;
  label?: string;
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [training] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        fileToasts.invalidType();
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        fileToasts.tooLarge(10);
        return;
      }
      
      setFile(selectedFile);
      fileToasts.selected(selectedFile.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
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
        fileToasts.dropped(droppedFile.name);
        
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

  const handleUpload = async () => {
    if (!file) {
      fileToasts.noFile();
      return;
    }
    if (!label.trim()) {
      fileToasts.noLabel();
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label.trim());

    let loadingToastId: string | undefined;

    try {
      setLoading(true);
      loadingToastId = showLoading('Uploading image...');
      
      const response: AxiosResponse<UploadResponse> = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      closeToast(loadingToastId);
      fileToasts.uploadSuccess();
      
      setUploadResult(response.data);
      setFile(null);
      setLabel("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      console.error(err);
      closeToast(loadingToastId);
      
      const error = err as { code?: string; response?: { data?: { message?: string } }; request?: unknown };
      
      if (error.code === 'ECONNABORTED') {
        genericToasts.error('Request timeout. Please try again.');
      } else if (error.response) {
        genericToasts.error(`Upload failed: ${error.response.data?.message || 'Server error'}`);
      } else if (error.request) {
        fileToasts.networkError();
      } else {
        genericToasts.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileToasts.removed();
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Upload Training Image</h2>
          <p className="opacity-90">Add labeled images to train your classification models</p>
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
            
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
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
                <p className="text-lg font-semibold mb-2 text-gray-700">Choose an image file</p>
                <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, WebP (Max 10MB)</p>
              </div>
            )}
          </div>

          {/* Label Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter descriptive label (e.g., cat, dog, car)"
              value={label}
              onChange={handleLabelChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading || training}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                loading || training
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Upload Image"
              )}
            </button>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Upload Successful!
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">File ID:</span>
                  <p className="text-gray-600">{uploadResult.image_id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Filename:</span>
                  <p className="text-gray-600">{uploadResult.filename}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Label:</span>
                  <p className="text-gray-600">{uploadResult.label || label}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Upload labeled images to train your machine learning models for accurate classification.</p>
      </div>
    </div>

    {/* Loading Modal */}
    {loading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Uploading Image</h3>
          <p className="text-gray-600 mb-4">Please wait while we process your image...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}