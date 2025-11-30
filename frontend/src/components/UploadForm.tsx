import { useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";

interface UploadResponse {
  status: boolean;
  image_id: number;
  filename: string;
  label?: string;
}

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState<string>(""); // <-- New state for label
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image first");
    if (!label) return alert("Enter a label for the image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label); // <-- Append label to FormData

    try {
      setLoading(true);
      const response: AxiosResponse<UploadResponse> = await axios.post(
        "http://localhost:8001/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadResult(response.data);
      alert(`File uploaded successfully: ${response.data.filename} with label: ${label}`);
      setFile(null);
      setLabel("");
    } catch (err) {
      console.error(err);
      alert("Error uploading image. Make sure the backend is running at http://localhost:8001");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <input
        type="text"
        placeholder="Enter label for image"
        value={label}
        onChange={handleLabelChange}
        className="mb-4 w-full px-3 py-2 border rounded"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {uploadResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>File ID:</strong> {uploadResult.image_id}</p>
          <p><strong>Filename:</strong> {uploadResult.filename}</p>
          <p><strong>Label:</strong> {uploadResult.label || label}</p>
        </div>
      )}
    </div>
  );
}
