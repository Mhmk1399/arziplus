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

const FileUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Handle multiple files
    Array.from(files).forEach((file) => {
      uploadFile(file);
    });
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
        setUploadedFiles((prev) => [...prev, result.data]);
        console.log(result.data);
        showToast.success(`File "${file.name}" uploaded successfully!`);
        setUploadProgress(100);
      } else {
        showToast.error(result.error || "Upload failed");
      }
    } catch (error) {
      showToast.error("Upload failed: Network error");
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="mt-20 bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] p-6"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Upload Area */}
        <div className="bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl rounded-2xl border border-[#4DBFF0] shadow-2xl p-8 mb-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
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
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt"
            />

            <div className="space-y-4">
              <div className="text-6xl text-[#4DBFF0]">📁</div>

              <div>
                <h3 className="text-xl font-bold text-[#0A1D37] mb-2">
                  فایل‌های خود را اینجا بکشید یا کلیک کنید
                </h3>
                <p className="text-[#0A1D37]/60 text-sm">
                  فرمت‌های مجاز: JPG, PNG, GIF, WebP, PDF, DOC, DOCX, TXT
                </p>
                <p className="text-[#0A1D37]/60 text-sm">حداکثر اندازه: 10MB</p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white px-8 py-3 rounded-xl font-medium hover:from-[#4DBFF0]/80 hover:to-[#FF7A00]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isUploading ? "در حال آپلود..." : "انتخاب فایل"}
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
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
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl rounded-2xl border border-[#4DBFF0] shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-[#0A1D37] mb-6">
              فایل‌های آپلود شده ({uploadedFiles.length})
            </h2>

            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-xl p-4 border border-[#4DBFF0]/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1"></div>

                    <div className="flex items-center space-x-reverse space-x-4">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#4DBFF0]/20  text-[#4DBFF0] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4DBFF0]/30 transition-colors"
                      >
                        مشاهده
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(file.url)}
                        className="bg-[#FF7A00]/20 mr-2 text-[#FF7A00] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF7A00]/30 transition-colors"
                      >
                        کپی لینک
                      </button>
                    </div>
                  </div>

                  {/* Preview for images */}
                  {file.type.startsWith("image/") && (
                    <div className="mt-4">
                      <Image
                        src={file.url}
                        alt={file.originalName}
                        width={300}
                        height={200}
                        className="max-w-xs max-h-48 rounded-lg border border-[#4DBFF0]/30 object-cover"
                      />
                    </div>
                  )}

                  {/* File Details */}
                  <div className="mt-3 pt-3 border-t border-[#4DBFF0]/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#0A1D37]/60">
                      <div>
                        <span className="font-medium">نوع:</span>
                        <p>{file.type}</p>
                      </div>
                      <div>
                        <span className="font-medium">اندازه:</span>
                        <p>{formatFileSize(file.size)}</p>
                      </div>
                      <div>
                        <span className="font-medium">تاریخ:</span>
                        <p>
                          {new Date(file.uploadedAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
      </div>
    </div>
  );
};

export default FileUploader;
