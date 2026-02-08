# Agent Instructions

## Project Overview

**AI Video Generation & Editing Platform** - A platform leveraging Alibaba's Wan2.6 models for AI video generation and FFmpeg for post-processing, designed to create YouTube-compliant short videos.

**Key Features:**
- AI Video Generation (Text-to-Video, Image-to-Video, Reference-to-Video)
- Video Editing Pipeline (FFmpeg-based processing)
- YouTube Compliance Engine
- Web Interface with real-time previews

## Technology Stack

- **Frontend:** React 19.1.1 + TypeScript + Vite 7.1.2
- **Backend:** Cloudflare Workers (Serverless)
- **Deployment:** Cloudflare Pages (Frontend) + Cloudflare Workers (Backend)
- **Video Generation:** Alibaba BaiLian Wan2.6 API (DASHSCOPE)
- **Video Processing:** FFmpeg
- **Package Manager:** npm

## Project Structure

```
genvideo/
├── src/
│   ├── components/
│   │   ├── VideoGenerator.tsx      # Text/Image/Reference to video generation UI
│   │   ├── VideoEditor.tsx          # Video editing tools UI
│   │   └── YouTubeComplianceChecker.tsx  # YouTube validation UI
│   ├── utils/
│   │   └── api.ts                   # API client with polling logic
│   ├── types.ts                     # TypeScript type definitions
│   └── App.tsx                      # Main application with tab navigation
├── worker/
│   ├── index.ts                     # Cloudflare Worker entry point
│   └── videoService.ts              # Video processing service
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite configuration with Cloudflare plugin
├── wrangler.jsonc                   # Cloudflare Workers configuration
└── tsconfig*.json                   # TypeScript configurations
```

## Development Commands

### Local Development
```bash
npm install              # Install dependencies
npm run dev             # Start Vite dev server (localhost:5173)
npm run build           # Build for production (TypeScript + Vite)
npm run lint            # Run ESLint
npm run preview         # Preview production build locally
```

### Deployment
```bash
npm run deploy          # Build and deploy to Cloudflare Workers
npm run cf-typegen      # Generate Cloudflare Worker types
```

## Configuration & Secrets

### Environment Variables
Create a `.dev.vars` file in the root directory:
```
DASHSCOPE_API_KEY=your_alibaba_dashscope_api_key
```

### Wrangler Secrets (Production)
```bash
wrangler secret put DASHSCOPE_API_KEY
```

## API Endpoints

All endpoints are served from the Cloudflare Worker (`worker/index.ts`):

- `POST /api/video/generate` - Generate video (t2v/i2v/r2v)
- `GET /api/video/status?taskId={taskId}` - Check generation status
- `POST /api/video/compliance` - Validate YouTube compliance
- `POST /api/video/edit` - Edit and process videos

### Video Generation Request Example
```json
{
  "prompt": "A beautiful sunset over mountains",
  "type": "t2v|i2v|r2v",
  "params": {
    "image_url": "https://...",  // For i2v
    "reference_url": "https://...", // For r2v
    "video_cfg": {
      "duration": 5,
      "width": 1080,
      "height": 1920
    }
  }
}
```

## Key Components

### VideoGenerator (`src/components/VideoGenerator.tsx`)
- Handles video generation from text, images, or references
- Manages async task submission and polling
- Displays generation progress and results

### VideoEditor (`src/components/VideoEditor.tsx`)
- UI for post-processing videos
- Supports audio removal, watermarking, resizing
- Real-time preview of edits

### YouTubeComplianceChecker (`src/components/YouTubeComplianceChecker.tsx`)
- Validates videos against YouTube upload policies
- Checks resolution, frame rate, duration, aspect ratio
- Provides compliance report

## Code Conventions

- **Language:** TypeScript with strict type checking
- **Framework:** React with functional components and hooks
- **Styling:** CSS modules (App.css, index.css)
- **State Management:** React useState/useEffect
- **API Pattern:** Async/await with error handling
- **File Naming:** PascalCase for components, camelCase for utilities

## Quality Standards

### Before Committing
1. Run `npm run lint` - Ensure no ESLint errors
2. Run `npm run build` - Verify production build succeeds
3. Test all modified components manually

### Type Safety
- All components must use TypeScript
- Prop types must be defined in `types.ts`
- No `any` types unless absolutely necessary

## Issue Tracking

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
   ```bash
   npm run lint
   npm run build
   ```
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

## Security Considerations

- **API Keys:** Never commit `DASHSCOPE_API_KEY` or any secrets
- **Secrets Storage:** Use Cloudflare Worker secrets for production
- **CORS:** All API endpoints support CORS for cross-origin requests
- **Environment Variables:** Use `.dev.vars` for local development (gitignored)

## Troubleshooting

### Build Errors
- Check TypeScript versions in `tsconfig*.json`
- Verify all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules/.vite`

### Deployment Issues
- Verify Wrangler is authenticated: `wrangler whoami`
- Check Cloudflare account permissions
- Ensure secrets are properly configured

### API Integration
- Verify DASHSCOPE_API_KEY is valid
- Check Alibaba Cloud API quotas
- Review API endpoint URLs in `worker/index.ts`

