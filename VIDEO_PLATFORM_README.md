# AI Video Generation & Editing Platform

This platform leverages Alibaba's Wan2.6 models for AI video generation and FFmpeg for post-processing, designed to create YouTube-compliant short videos.

## Features

- **AI Video Generation**: Integrate with Alibaba BaiLian Wan2.6 API for Text-to-Video (t2v), Image-to-Video (i2v), and Reference-to-Video (r2v)
- **Video Editing**: Post-process videos using FFmpeg for operations like removing audio, adding subtitles, and applying watermarks
- **YouTube Compliance**: Validate videos against YouTube's upload policies and technical specifications
- **Web Interface**: User-friendly dashboard for video creation and editing with real-time previews

## Architecture

### Frontend
- Built with React and TypeScript
- Hosted on Cloudflare Pages
- Components:
  - VideoGenerator: UI for generating videos from text, images, or references
  - VideoEditor: Tools for post-processing videos
  - YouTubeComplianceChecker: Validates videos against YouTube guidelines

### Backend
- Cloudflare Worker (serverless functions)
- Handles API requests to Alibaba's Wan2.6 models
- Manages video processing workflows
- Implements YouTube compliance checking

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account
- Alibaba Cloud account with access to Wan2.6 models

### Environment Variables
Create a `.dev.vars` file in the root directory:
```
DASHSCOPE_API_KEY=your_alibaba_dashscope_api_key
```

### Installation
1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. To deploy to Cloudflare Pages:
```bash
npm run deploy
```

## API Endpoints

### Video Generation
- `POST /api/video/generate` - Generate video from text/image/reference
- Request body:
```json
{
  "prompt": "Describe the video",
  "type": "t2v|i2v|r2v",
  "params": {
    "image_url": "URL for i2v",
    "reference_url": "URL for r2v",
    "video_cfg": {
      "duration": 5,
      "width": 1080,
      "height": 1920
    }
  }
}
```

### Video Status
- `GET /api/video/status?taskId={taskId}` - Check generation status

### Video Editing
- `POST /api/video/edit` - Edit and process videos
- Request body:
```json
{
  "inputPath": "source video URL",
  "outputPath": "destination path",
  "options": {
    "removeAudio": true,
    "watermarkPath": "watermark URL",
    "targetResolution": "1080p",
    "targetFrameRate": 30
  }
}
```

### YouTube Compliance
- `POST /api/video/compliance` - Validate YouTube compliance
- Request body:
```json
{
  "videoPath": "video URL to check"
}
```

## Implementation Details

### Video Generation Workflow
1. Submit a generation request with prompt and parameters
2. API creates a task and returns a task ID
3. Poll for completion status using the task ID
4. Retrieve the generated video when ready

### Video Editing Capabilities
- Remove audio tracks
- Add watermarks at specified positions
- Resize videos to target resolutions
- Adjust frame rates
- Trim to duration limits

### YouTube Compliance Checking
- Validates resolution (up to 1080p)
- Checks frame rate (up to 60fps)
- Verifies duration (under 15 minutes for Shorts)
- Ensures proper aspect ratios

## Security Considerations
- API keys are stored securely as Cloudflare Worker secrets
- Client-side code never exposes sensitive credentials
- All API communications use HTTPS

## Deployment
The frontend is designed for deployment on Cloudflare Pages, while the backend runs as Cloudflare Workers. This serverless architecture provides scalability and global distribution.

## Technologies Used
- React: Frontend framework
- TypeScript: Type safety
- Cloudflare Workers: Serverless backend
- Cloudflare Pages: Static hosting
- FFmpeg: Video processing (simulated in this implementation)
- Alibaba Wan2.6: AI video generation models