import UploadForm from "./components/UploadForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Image Classification</h1>
      <UploadForm />
    </div>
  );
}

export default App;
