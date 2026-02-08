// utils/api.ts - API utility functions for the video generation platform

import { 
  VideoGenerationRequest, 
  VideoGenerationResponse, 
  VideoEditRequest, 
  VideoEditResponse,
  ComplianceRequest,
  ComplianceResponse
} from '../types';

const API_BASE_URL = '/api';

class ApiClient {
  static async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const response = await fetch(`${API_BASE_URL}/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getVideoStatus(taskId: string): Promise<VideoGenerationResponse> {
    const response = await fetch(`${API_BASE_URL}/video/status?taskId=${taskId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async editVideo(request: VideoEditRequest): Promise<VideoEditResponse> {
    const response = await fetch(`${API_BASE_URL}/video/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async checkCompliance(request: ComplianceRequest): Promise<ComplianceResponse> {
    const response = await fetch(`${API_BASE_URL}/video/compliance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Poll for video generation completion with timeout
  static async pollForCompletion(
    taskId: string, 
    intervalMs: number = 5000, 
    maxAttempts: number = 24 // 2 minutes with 5-second intervals
  ): Promise<VideoGenerationResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getVideoStatus(taskId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      // Wait for the next poll
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    
    throw new Error(`Video generation timed out after ${maxAttempts * intervalMs / 1000} seconds`);
  }
}

export default ApiClient;