"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { showToast } from "@/utilities/toast";

interface UploadedFile {
  key: string;
  url: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface FileUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUploaded: (fileUrl: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  title?: string;
}

const FileUploaderModal: React.FC<FileUploaderModalProps> = ({
  isOpen,
  onClose,
  onFileUploaded,
  acceptedTypes = [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  title = "آپلود تصویر",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Handle single file for modal
    const file = files[0];
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedFile = result.data;
        setUploadedFiles([uploadedFile]); // Only keep the latest file for modal
        showToast.success(`فایل "${file.name}" با موفقیت آپلود شد!`);
        setUploadProgress(100);

        // Auto-select the uploaded file after a short delay
        setTimeout(() => {
          onFileUploaded(uploadedFile.url);
          handleClose();
        }, 1500);
      } else {
        showToast.error(result.error || "آپلود ناموفق بود");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast.error("خطا در آپلود فایل");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setIsUploading(false);
    setUploadProgress(0);
    setDragActive(false);
    onClose();
  };

  const handleSelectFile = (fileUrl: string) => {
    onFileUploaded(fileUrl);
    handleClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl border border-[#4DBFF0]/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#4DBFF0]/20">
          <h2 className="text-2xl font-bold text-[#0A1D37]">{title}</h2>
          <button
            onClick={handleClose}
            className="text-[#0A1D37]/60 hover:text-[#0A1D37] text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 mb-6 ${
              dragActive
                ? "border-[#FF7A00] bg-[#FF7A00]/10"
                : "border-[#4DBFF0]/50 hover:border-[#4DBFF0] hover:bg-[#4DBFF0]/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              accept={acceptedTypes.join(",")}
            />

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0A1D37] mb-2">
                  تصویر خود را اینجا بکشید یا کلیک کنید
                </h3>
                <p className="text-[#0A1D37]/60 text-sm">
                  فرمت‌های مجاز: JPG, PNG, GIF, WebP
                </p>
                <p className="text-[#0A1D37]/60 text-sm">
                  حداکثر اندازه: {Math.round(maxFileSize / (1024 * 1024))}MB
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[#0A1D37] border border-[#4DBFF0] hover:bg-[#0A1D37]/10 px-8 py-3 rounded-xl font-medium hover:from-[#4DBFF0]/80 hover:to-[#FF7A00]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isUploading ? "در حال آپلود..." : "انتخاب تصویر"}
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#0A1D37] font-medium">
                  در حال آپلود...
                </span>
                <span className="text-[#0A1D37]/60">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#4DBFF0]/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#0A1D37]">
                فایل آپلود شده:
              </h3>

              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-white/20 rounded-xl p-4 border border-[#4DBFF0]/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className="text-2xl">🖼️</div>
                      <div>
                        <h4 className="font-medium text-[#0A1D37]">
                          {file.originalName}
                        </h4>
                        <p className="text-[#0A1D37]/60 text-sm">
                          {formatFileSize(file.size)} •{" "}
                          {new Date(file.uploadedAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {file.type.startsWith("image/") && (
                    <div className="mb-4">
                      <Image
                        src={file.url}
                        alt={file.originalName}
                        width={400}
                        height={200}
                        className="w-full max-h-48 rounded-lg border border-[#4DBFF0]/30 object-cover"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-reverse space-x-2">
                    <button
                      onClick={() => handleSelectFile(file.url)}
                      className="bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white px-6 py-2 rounded-lg font-medium hover:from-[#4DBFF0]/80 hover:to-[#FF7A00]/80 transition-all duration-300"
                    >
                      انتخاب این تصویر
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(file.url)}
                      className="bg-[#FF7A00]/20 text-[#FF7A00] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF7A00]/30 transition-colors"
                    >
                      کپی لینک
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-[#4DBFF0]/20 space-x-reverse space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-[#0A1D37] border border-[#FF7A00]/50 rounded-lg hover:bg-[#FF7A00]/10 transition-colors"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderModal;
