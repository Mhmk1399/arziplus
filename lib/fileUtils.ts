// Utility functions for CloudFront file URL management

export interface CloudFrontFileInfo {
  key: string;
  url: string;
  originalName?: string;
  size?: number;
  type?: string;
  uploadedAt?: string;
}

/**
 * Generate CloudFront URL from S3 key (no expiration - permanent URLs)
 * @param key - The S3 file key
 * @returns CloudFront URL
 */
export function getCloudFrontUrl(key: string): string {
  const cloudFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || process.env.AWS_CLOUDFRONT_DOMAIN;
  
  if (!cloudFrontDomain) {
    console.error('CloudFront domain not configured');
    return '';
  }
  
  return `https://${cloudFrontDomain}/${key}`;
}

/**
 * Generate CloudFront URLs from multiple S3 keys
 * @param keys - Array of S3 file keys
 * @returns Array of CloudFront URLs
 */
export function getCloudFrontUrls(keys: string[]): string[] {
  return keys.map(key => getCloudFrontUrl(key));
}

/**
 * Extract S3 key from CloudFront URL
 * @param url - CloudFront URL
 * @returns S3 key
 */
export function extractKeyFromUrl(url: string): string {
  const cloudFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || process.env.AWS_CLOUDFRONT_DOMAIN;
  
  if (!cloudFrontDomain || !url.includes(cloudFrontDomain)) {
    return '';
  }
  
  return url.split(`${cloudFrontDomain}/`)[1] || '';
}

/**
 * Upload a file to S3 and get back the file info with signed URL
 * @param file - File object to upload
 * @returns Promise with upload response
 */
export async function uploadFile(file: File): Promise<CloudFrontFileInfo | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    console.error('Upload failed:', result.error);
    return null;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

/**
 * Format file size in human readable format
 * @param bytes - Size in bytes
 * @returns Formatted string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type icon emoji
 * @param mimeType - File MIME type
 * @returns Emoji string
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  if (mimeType.includes('text')) return '📄';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  return '📁';
}