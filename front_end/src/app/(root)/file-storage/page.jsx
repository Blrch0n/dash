import ProtectedRoute from "@/components/ProtectedRoute";
import FileStorageManager from "@/components/FileStorageManager";

export default function FileStoragePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <FileStorageManager />
      </div>
    </ProtectedRoute>
  );
}
