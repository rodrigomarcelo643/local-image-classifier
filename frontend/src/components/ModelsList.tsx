import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  modelToasts,
  genericToasts,
  showPromise,
  showLoading,
  closeToast,
} from '../utils/toast';
import SkeletonLoader from './SkeletonLoader';
import { API_BASE_URL } from '../config/api';

interface Model {
  id: number;
  name: string;
  path: string;
  accuracy?: number;
  created_at?: string;
  status?: 'training' | 'trained' | 'failed';
  classes?: string[];
  size?: string;
  last_used?: string;
}

interface TrainingData {
  label: string;
  count: number;
  sample_files: string[];
}

interface UploadedData {
  label: string;
  count: number;
  sample_files: string[];
}

export default function ModelsList() {
  const [models, setModels] = useState<Model[]>([]);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [uploadedData, setUploadedData] = useState<UploadedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<{
    is_training: boolean;
    progress: string;
  }>({ is_training: false, progress: '' });
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [modalImages, setModalImages] = useState<
    { filename: string; filepath: string }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalLabel, setModalLabel] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const loadingToast = showLoading('Loading trained models...');

      const [modelsRes, trainingRes, uploadedRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/models`),
        axios.get(`${API_BASE_URL}/training-data`),
        axios.get(`${API_BASE_URL}/uploaded-data`),
      ]);

      setModels(modelsRes.data.models || []);
      setTrainingData(trainingRes.data.training_data || []);
      setUploadedData(uploadedRes.data.uploaded_data || []);

      closeToast(loadingToast);
      if (
        modelsRes.data.models?.length > 0 ||
        trainingRes.data.training_data?.length > 0
      ) {
        genericToasts.success(
          `Loaded ${modelsRes.data.models?.length || 0} models, ${
            trainingRes.data.training_data?.length || 0
          } trained labels, and ${
            uploadedRes.data.uploaded_data?.length || 0
          } uploaded labels`
        );
      }
    } catch (err) {
      console.error(err);
      modelToasts.loadError();
    } finally {
      setLoading(false);
    }
  };

  const openTrainingModal = () => {
    if (uploadedData.length === 0) {
      genericToasts.error(
        'No uploaded data available. Please upload some images first.'
      );
      return;
    }
    setSelectedLabels(uploadedData.map((data) => data.label));
    setShowTrainingModal(true);
  };

  const trainNewModel = async () => {
    if (selectedLabels.length === 0) {
      genericToasts.error('Please select at least one label to train on.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/train`, { labels: selectedLabels });
      genericToasts.success('Model training started successfully!');
      setShowTrainingModal(false);

      // Start polling training status
      const pollStatus = setInterval(async () => {
        try {
          const statusRes = await axios.get(`${API_BASE_URL}/training-status`);
          setTrainingStatus(statusRes.data);

          if (!statusRes.data.is_training) {
            clearInterval(pollStatus);
            fetchModels(); // Refresh data after training completes
            genericToasts.success('Model training completed!');
          }
        } catch (err) {
          console.error('Failed to fetch training status:', err);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      genericToasts.error(
        'Model training failed. Please check your uploaded images.'
      );
    }
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const deleteModel = async (modelId: number, modelName: string) => {
    if (
      !window.confirm(`Are you sure you want to delete model "${modelName}"?`)
    ) {
      return;
    }

    try {
      await showPromise(axios.delete(`${API_BASE_URL}/models/${modelId}`), {
        loading: `Deleting model ${modelName}...`,
        success: `Model ${modelName} deleted successfully!`,
        error: `Failed to delete model ${modelName}`,
      });
      // Refresh the models list and clear selection if deleted model was selected
      setModels((prev) => prev.filter((model) => model.id !== modelId));
      if (selectedModel?.id === modelId) {
        setSelectedModel(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const useModel = async (model: Model) => {
    genericToasts.success(`Model ${model.name} selected for classification`);
    // You can add additional logic here for using the model
  };

  const downloadModel = async (model: Model) => {
    try {
      const loadingToast = showLoading(
        `Preparing ${model.name} for download...`
      );

      // Simulate download process
      setTimeout(() => {
        closeToast(loadingToast);
        genericToasts.success(`Model ${model.name} download started`);

        // Create a fake download link (in real app, this would be your actual download endpoint)
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${model.name}.model`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1500);
    } catch (err) {
      genericToasts.error('Download failed. Please try again.');
    }
  };

  const viewImages = async (label: string, isTrainedData: boolean = false) => {
    try {
      const endpoint = isTrainedData
        ? `/training-images/${label}`
        : `/sample-images/${label}`;
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      const images = response.data.images || [];

      if (images.length === 0) {
        genericToasts.error('No images found for this label.');
        return;
      }

      setModalImages(images);
      setModalLabel(label);
      setCurrentImageIndex(0);
      setShowImagesModal(true);
    } catch (err) {
      console.error(err);
      genericToasts.error('Failed to load images.');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  // Filter models based on search and status
  const filteredModels = models.filter((model) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      model.name?.toLowerCase().includes(searchLower) ||
      model.path?.toLowerCase().includes(searchLower) ||
      model.classes?.some((cls) => cls.toLowerCase().includes(searchLower)) ||
      model.size?.toLowerCase().includes(searchLower) ||
      model.id?.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === 'all' || model.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'training':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'trained':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'training':
        return (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case 'trained':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'failed':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <SkeletonLoader variant="card" className="mb-8 h-32" />
        <SkeletonLoader variant="card" className="mb-8 h-20" />
        <div className="space-y-8">
          <SkeletonLoader variant="grid" count={6} />
          <SkeletonLoader variant="list" count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trained Models</h2>
            <p className="text-green-100 text-lg">
              Manage and monitor your machine learning models ({models.length}{' '}
              model{models.length !== 1 ? 's' : ''} available)
            </p>
          </div>
          <button
            onClick={openTrainingModal}
            className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Train New Model</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Models
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            >
              <option value="all">All Statuses</option>
              <option value="trained">Trained</option>
              <option value="training">Training</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {!models.length && !uploadedData.length && !trainingData.length ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-green-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            No Training Data Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start by uploading labeled images and training your first model to
            see data here.
          </p>
          <button
            onClick={openTrainingModal}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
          >
            Train Your First Model
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Uploaded Data Section */}
          {uploadedData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Available for Training ({uploadedData.length} labels)
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedData.map((data, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {data.label}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            {data.count} images
                          </span>
                          <button
                            onClick={() => viewImages(data.label)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            title="View all images"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {data.sample_files.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {data.sample_files.map((filename, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={`${API_BASE_URL}/static/train/${data.label}/${filename}`}
                                alt={`${data.label} sample ${imgIndex + 1}`}
                                className="w-full h-16 object-cover rounded border border-blue-300"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNFYzNk0zMiA0NEgzNk0zNiAyNEgzMk0zMiAyNEgyOE0yOCAyNFYyNC4wMU0yOCAzNlYzNk0yOCA0NEgyOC4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Training Data Section */}
          {trainingData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                  Trained Data ({trainingData.length} labels)
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Used in Models
                  </span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainingData.map((data, index) => (
                    <div
                      key={index}
                      className="bg-green-50 rounded-lg p-4 border border-green-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {data.label}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {data.count} images
                          </span>
                          <button
                            onClick={() => viewImages(data.label)}
                            className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                            title="View all images"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {data.sample_files.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {data.sample_files.map((filename, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={`${API_BASE_URL}/static/train/${data.label}/${filename}`}
                                alt={`${data.label} sample ${imgIndex + 1}`}
                                className="w-full h-16 object-cover rounded border border-green-300"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNFYzNk0zMiA0NEgzNk0zNiAyNEgzMk0zMiAyNEgyOE0yOCAyNFYyNC4wMU0yOCAzNlYzNk0yOCA0NEgyOC4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Models List */}
          {models.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                  Available Models{' '}
                  {filteredModels.length > 0 && `(${filteredModels.length})`}
                  {trainingStatus.is_training && (
                    <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <svg
                        className="animate-spin w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Training...
                    </span>
                  )}
                </h3>
                <button
                  onClick={fetchModels}
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>

              {/* Training Status */}
              {trainingStatus.is_training && (
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="animate-spin w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <div>
                        <p className="font-medium text-blue-800">
                          Training in Progress
                        </p>
                        <p className="text-sm text-blue-600">
                          {trainingStatus.progress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {filteredModels.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">No models found</p>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {filteredModels.map((model) => (
                    <div
                      key={model.id}
                      className={`p-6 hover:bg-green-50 cursor-pointer transition-all duration-200 group ${
                        selectedModel?.id === model.id
                          ? 'bg-green-50 border-l-4 border-green-500'
                          : ''
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-800 truncate">
                              {model.name}
                            </h4>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                model.status
                              )}`}
                            >
                              {getStatusIcon(model.status)}
                              <span className="ml-1 capitalize">
                                {model.status || 'unknown'}
                              </span>
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 truncate">
                            <span className="font-medium">Path:</span>{' '}
                            {model.path}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {model.accuracy && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">
                                  Accuracy:
                                </span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${model.accuracy}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-700 ml-2">
                                  {model.accuracy}%
                                </span>
                              </div>
                            )}

                            {model.classes && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">
                                  Classes:
                                </span>
                                <span>{model.classes.length}</span>
                              </div>
                            )}

                            {model.size && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">Size:</span>
                                <span>{model.size}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              useModel(model);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Use Model"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadModel(model);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Download Model"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteModel(model.id, model.name);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Model"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(model.created_at || model.last_used) && (
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                          {model.created_at && (
                            <div>
                              <span className="font-medium">Created:</span>{' '}
                              {new Date(model.created_at).toLocaleDateString()}
                            </div>
                          )}
                          {model.last_used && (
                            <div>
                              <span className="font-medium">Last Used:</span>{' '}
                              {new Date(model.last_used).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Training Selection Modal */}
      {showTrainingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Select Training Data
              </h3>
              <button
                onClick={() => setShowTrainingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Choose which labels to include in your model training:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {uploadedData.map((data, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLabels.includes(data.label)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => toggleLabel(data.label)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">
                        {data.label}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {data.count} images
                        </span>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedLabels.includes(data.label)
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedLabels.includes(data.label) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {data.sample_files.length > 0 && (
                      <div className="grid grid-cols-3 gap-1">
                        {data.sample_files.map((filename, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={`${API_BASE_URL}/static/train/${data.label}/${filename}`}
                            alt={`${data.label} sample`}
                            className="w-full h-12 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src =
                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNFYzNk0zMiA0NEgzNk0zNiAyNEgzMk0zMiAyNEgyOE0yOCAyNFYyNC4wMU0yOCAzNlYzNk0yOCA0NEgyOC4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedLabels.length} of {uploadedData.length} labels
                  selected
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedLabels([])}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() =>
                      setSelectedLabels(uploadedData.map((data) => data.label))
                    }
                    className="px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={trainNewModel}
                    disabled={
                      selectedLabels.length === 0 || trainingStatus.is_training
                    }
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      selectedLabels.length === 0 || trainingStatus.is_training
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {trainingStatus.is_training
                      ? 'Training...'
                      : `Train Model (${selectedLabels.length} labels)`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Images Modal */}
      {showImagesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {modalLabel} Images ({modalImages.length} total)
              </h3>
              <button
                onClick={() => setShowImagesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {modalImages.length === 1 ? (
              // Single image display
              <div className="p-6 flex justify-center">
                <img
                  src={`${API_BASE_URL}/static/train/${modalLabel}/${modalImages[0].filename}`}
                  alt={modalImages[0].filename}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNFYzNk0zMiA0NEgzNk0zNiAyNEgzMk0zMiAyNEgyOE0yOCAyNFYyNC4wMU0yOCAzNlYzNk0yOCA0NEgyOC4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
            ) : (
              // Carousel for multiple images
              <div className="relative">
                <div className="p-6 flex justify-center items-center min-h-96">
                  <img
                    src={`${API_BASE_URL}/static/train/${modalLabel}/${modalImages[currentImageIndex].filename}`}
                    alt={modalImages[currentImageIndex].filename}
                    className="max-w-full max-h-80 object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNFYzNk0zMiA0NEgzNk0zNiAyNEgzMk0zMiAyNEgyOE0yOCAyNFYyNC4wMU0yOCAzNlYzNk0yOCA0NEgyOC4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>

                {/* Navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {modalImages.length}
                </div>

                {/* Thumbnail navigation */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {modalImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? 'border-green-500'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={`${API_BASE_URL}/static/train/${modalLabel}/${image.filename}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNFYzNk0zMiA0NEgzNk0zNiAyNEgzMk0zMiAyNEgyOE0yOCAyNFYyNC4wMU0yOCAzNlYzNk0yOCA0NEgyOC4wMSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600">
              {modalImages.length === 1 ? (
                <span>Filename: {modalImages[0].filename}</span>
              ) : (
                <span>Filename: {modalImages[currentImageIndex].filename}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
