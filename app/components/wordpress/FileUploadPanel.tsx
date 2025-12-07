// components/FileUploadPanel.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { documentService } from "@/app/(main)/lib/services/document.service";

export const FileUploadPanel = ({
  onFilesUpload,
}: {
  onFilesUpload: (files: any[]) => void;
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Set loading state if needed (not implemented in UI yet, but good practice)
    
    try {
      const newFiles = await Promise.all(files.map(async (file) => {
        // Use the document service to upload
        const uploadedDoc = await documentService.uploadDocument(file);
        return {
          ...uploadedDoc,
          status: "uploaded",
        };
      }));

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesUpload(updatedFiles);
    } catch (error) {
      console.error("Upload failed:", error);
      // Handle error (e.g. show toast)
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUpload(updatedFiles);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Upload Design Files
      </h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Drop your design files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Supports: FIGMA, Sketch, Adobe XD, PSD, AI files
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept=".figma,.sketch,.xd,.psd,.ai,.pdf,.png,.jpg,.jpeg"
        />
        <label
          htmlFor="file-upload"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium"
        >
          Choose Files
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
