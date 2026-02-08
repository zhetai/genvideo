// types.ts - Type definitions for the video generation platform

export interface VideoGenerationRequest {
  prompt: string;
  type: 't2v' | 'i2v' | 'r2v'; // Text-to-Video, Image-to-Video, Reference-to-Video
  params?: {
    image_url?: string;
    reference_url?: string;
    video_cfg?: {
      duration?: number;
      width?: number;
      height?: number;
      [key: string]: any; // Allow additional configuration options
    };
    [key: string]: any; // Allow additional parameters
  };
}

export interface VideoGenerationResponse {
  taskId?: string;
  videoUrl?: string;
  status?: string;
  result?: any;
  error?: string;
}

export interface VideoEditOptions {
  removeAudio?: boolean;
  addSubtitles?: boolean;
  watermarkPath?: string;
  watermarkPosition?: string; // e.g. "top-left", "bottom-right"
  targetResolution?: string; // e.g. "1080p", "720p"
  targetFrameRate?: number;
  durationLimit?: number; // in seconds
  [key: string]: any; // Allow additional options
}

export interface VideoEditRequest {
  inputPath: string;
  outputPath: string;
  options: VideoEditOptions;
}

export interface VideoEditResponse {
  success: boolean;
  message: string;
  editedVideoUrl?: string;
  error?: string;
}

export interface ComplianceRequest {
  videoPath: string;
}

export interface ComplianceResponse {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
  message?: string;
  error?: string;
}

export interface VideoMetadata {
  duration: number; // in seconds
  width: number;
  height: number;
  frameRate: number;
  fileSize: number; // in bytes
  format: string;
  hasAudio: boolean;
  hasCopyrightIssues?: boolean;
}

export interface TaskStatus {
  taskId: string;
  status: 'submitted' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  resultUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}