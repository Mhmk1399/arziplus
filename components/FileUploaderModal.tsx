"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { showToast } from "@/utilities/toast";
import {
  FaUpload,
  FaCheck,
  FaTimes,
  FaImage,
  FaCopy,
  FaCloudUploadAlt,
} from "react-icons/fa";

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
      console.log("Upload error:", error);
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
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
      dir="rtl"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in duration-300 border-2 border-[#4DBFF0]/20">
        {/* Header - Enhanced */}
        <div className="bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] p-5 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FaCloudUploadAlt className="text-white text-2xl sm:text-3xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {title}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  فایل خود را آپلود کنید
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 sm:w-12 sm:h-12 text-white hover:bg-white/20 rounded-xl transition-all duration-300 flex items-center justify-center hover:rotate-90"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-5 sm:p-6 lg:p-4 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-200px)] md:max-h-[calc(95vh-300px)] custom-scrollbar">
          {/* Upload Area - Enhanced */}
          <div
            className={`
              relative 
              border-3 border-dashed 
              rounded-2xl sm:rounded-3xl 
              p-8 sm:p-8 
              text-center 
              transition-all duration-300 
              cursor-pointer
              group
              ${
                dragActive
                  ? "border-[#FF7A00] bg-gradient-to-br from-[#FF7A00]/10 to-[#4DBFF0]/10 scale-[1.02] shadow-xl"
                  : "border-[#4DBFF0]/40 hover:border-[#4DBFF0] hover:bg-[#4DBFF0]/5 hover:shadow-lg"
              }
              ${isUploading ? "pointer-events-none opacity-60" : ""}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              accept={acceptedTypes.join(",")}
              disabled={isUploading}
            />

            <div className="space-y-5 sm:space-y-2">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className={`
                  w-20 h-20 sm:w-20 sm:h-20 
                  rounded-2xl sm:rounded-3xl 
                  flex items-center justify-center 
                  transition-all duration-300
                  ${
                    dragActive
                      ? "bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] scale-110"
                      : "bg-[#4DBFF0]/10 group-hover:bg-[#4DBFF0]/20 group-hover:scale-110"
                  }
                `}
                >
                  <FaCloudUploadAlt
                    className={`
                    text-xl sm:text-3xl 
                    transition-colors duration-300
                    ${
                      dragActive
                        ? "text-white"
                        : "text-[#4DBFF0] group-hover:text-[#FF7A00]"
                    }
                  `}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-1 sm:space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1D37]">
                  {dragActive
                    ? "فایل را اینجا رها کنید"
                    : "فایل را بکشید و رها کنید"}
                </h3>
                <p className="text-[#0A1D37]/70 text-sm sm:text-base">
                  یا برای انتخاب کلیک کنید
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    فرمت‌های مجاز
                  </p>
                  <p className="text-sm text-blue-700 font-bold">
                    JPG, PNG, GIF, WebP
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                  <p className="text-xs text-purple-600 font-medium mb-1">
                    حداکثر اندازه
                  </p>
                  <p className="text-sm text-purple-700 font-bold">
                    {Math.round(maxFileSize / (1024 * 1024))} مگابایت
                  </p>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className={`
                  inline-flex items-center justify-center gap-3
                  px-8 py-4
                  rounded-xl sm:rounded-2xl
                  font-bold text-sm sm:text-base
                  transition-all duration-300
                  ${
                    isUploading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                  }
                `}
              >
                <FaUpload className="text-lg" />
                {isUploading ? "در حال آپلود..." : "انتخاب فایل"}
              </button>
            </div>
          </div>

          {/* Upload Progress - Enhanced */}
          {isUploading && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 sm:p-6 border-2 border-blue-200 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <FaUpload className="text-white" />
                  </div>
                  <div>
                    <span className="text-[#0A1D37] font-bold block text-sm sm:text-base">
                      در حال آپلود...
                    </span>
                    <span className="text-[#0A1D37]/60 text-xs sm:text-sm">
                      لطفا منتظر بمانید
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] bg-clip-text text-transparent">
                  {uploadProgress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          )}

          {/* Uploaded Files - Enhanced */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500 text-xl" />
                <h3 className="text-base sm:text-lg font-bold text-[#0A1D37]">
                  فایل آپلود شده
                </h3>
              </div>

              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 sm:p-6 border-2 border-green-300 shadow-lg"
                >
                  {/* File Info */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaImage className="text-white text-xl sm:text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#0A1D37] text-sm sm:text-base mb-1 truncate">
                        {file.originalName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#0A1D37]/70">
                        <span className="px-2 py-1 bg-white rounded-md font-medium">
                          {formatFileSize(file.size)}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(file.uploadedAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
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
                        unoptimized={true}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => handleSelectFile(file.url)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <FaCheck className="text-lg" />
                      انتخاب این فایل
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(file.url);
                        showToast.success("لینک کپی شد!");
                      }}
                      className="flex items-center justify-center gap-2 bg-white border-2 border-[#FF7A00]/30 text-[#FF7A00] px-6 py-3 rounded-xl font-bold hover:bg-[#FF7A00]/10 hover:border-[#FF7A00] transition-all duration-300"
                    >
                      <FaCopy className="text-base" />
                      کپی لینک
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 p-2 sm:p-2 border-t-2 border-gray-200 flex items-center justify-between">
          <div className="text-xs sm:text-sm text-gray-600">
            💡 فایل‌های شما به صورت امن آپلود می‌شوند
          </div>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 sm:px-8 sm:py-3 text-[#0A1D37] border-2 border-gray-300 rounded-3xl font-bold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderModal;
