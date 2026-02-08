{
  "projectName": "AI Video Generation & Editing Platform",
  "description": "A platform leveraging Alibaba's Wan2.6 models for AI video generation and FFmpeg for post-processing, designed to create YouTube-compliant short videos.",
  "version": "1.0.0",
  "stakeholders": [
    "Product Manager",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer"
  ],
  "goals": [
    "Integrate Wan2.6 t2v, i2v, r2v models via API.",
    "Provide a web interface for video creation and editing.",
    "Ensure all generated videos strictly adhere to YouTube's upload policies.",
    "Deploy the frontend on Cloudflare Pages."
  ],
  "functionalRequirements": [
    {
      "id": "FR-001",
      "title": "Video Generation Models Integration",
      "details": "The system must integrate with Alibaba BaiLian Wan2.6 API endpoints for Text-to-Video (t2v), Image-to-Video (i2v), and Reference-to-Video (r2v). It should support asynchronous task submission and polling to retrieve the resulting MP4 video URLs."
    },
    {
      "id": "FR-002",
      "title": "Video Editing Pipeline",
      "details": "A backend processing pipeline must be implemented using FFmpeg to handle raw video files from the generation step. Supported operations include removing audio tracks, burning subtitles onto video frames, and overlaying image watermarks at specified coordinates."
    },
    {
      "id": "FR-003",
      "title": "YouTube Compliance Engine",
      "details": "Before final delivery, every video must pass through a compliance check. This includes verifying technical specifications like resolution (up to 1080p), frame rate (30fps), aspect ratio (16:9 recommended), and duration limits (under 15 minutes for Shorts). The system must also ensure no copyrighted material is used in prompts or audio if not licensed."
    },
    {
      "id": "FR-004",
      "title": "User Interface & Preview",
      "details": "The frontend, hosted on Cloudflare Pages, must provide an intuitive dashboard for users to input prompts, upload images, and select editing options. A real-time video preview component is required to display the final result after processing is complete."
    }
  ],
  "nonFunctionalRequirements": [
    {
      "id": "NFR-001",
      "title": "Security",
      "details": "The DASHSCOPE_API_KEY and other sensitive credentials must never be exposed to the client-side. All interactions with external APIs must occur via secure backend proxies."
    },
    {
      "id": "NFR-002",
      "title": "Performance",
      "details": "Video generation tasks can be long-running; the UI must manage loading states gracefully. Backend functions should utilize efficient polling intervals and leverage cloud infrastructure for scalability."
    },
    {
      "id": "NFR-003",
      "title": "Deployment",
      "details": "The user interface must be deployable as a static site on Cloudflare Pages. The video processing logic must reside in a serverless function environment capable of executing FFmpeg binaries."
    }
  ],
  "technicalStack": {
    "frontend": "React / Vue on Cloudflare Pages",
    "backend": "Node.js Serverless Function (e.g., Alibaba Cloud FC)",
    "videoGeneration": "Alibaba BaiLian Wan2.6 API",
    "videoEditing": "FFmpeg",
    "storage": "Object Storage Service (e.g., Alibaba Cloud OSS)"
  }
}
