// Utility functions for S3 file URL management

export interface S3FileInfo {
  key: string;
  url: string;
  originalName?: string;
  size?: number;
  type?: string;
  uploadedAt?: string;
  urlExpiry?: string;
}

/**
 * Get a fresh pre-signed URL for an S3 file key
 * @param key - The S3 file key
 * @param expiresIn - Expiration time in seconds (default: 7 days)
 * @returns Promise with the signed URL response
 */
export async function getSignedFileUrl(key: string, expiresIn: number = 604800): Promise<S3FileInfo | null> {
  try {
    const response = await fetch(`/api/upload/get-url?key=${encodeURIComponent(key)}&expires=${expiresIn}`);
    const result = await response.json();
    
    if (result.success) {
      return {
        key,
        url: result.data.url,
        urlExpiry: result.data.expiresAt
      };
    }
    
    console.error('Failed to get signed URL:', result.error);
    return null;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return null;
  }
}

/**
 * Get fresh pre-signed URLs for multiple S3 file keys
 * @param keys - Array of S3 file keys
 * @param expiresIn - Expiration time in seconds (default: 7 days)
 * @returns Promise with array of signed URL responses
 */
export async function getSignedFileUrls(keys: string[], expiresIn: number = 604800): Promise<S3FileInfo[]> {
  try {
    const response = await fetch('/api/upload/get-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys, expiresIn }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data.map((item: any) => ({
        key: item.key,
        url: item.url,
        urlExpiry: result.expiresAt,
        success: item.success
      }));
    }
    
    console.error('Failed to get signed URLs:', result.error);
    return [];
  } catch (error) {
    console.error('Error getting signed URLs:', error);
    return [];
  }
}

/**
 * Check if a URL is expired based on its expiry date
 * @param urlExpiry - ISO date string of when the URL expires
 * @returns boolean indicating if the URL is expired
 */
export function isUrlExpired(urlExpiry?: string): boolean {
  if (!urlExpiry) return false;
  return new Date(urlExpiry) < new Date();
}

/**
 * Upload a file to S3 and get back the file info with signed URL
 * @param file - File object to upload
 * @returns Promise with upload response
 */
export async function uploadFile(file: File): Promise<S3FileInfo | null> {
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