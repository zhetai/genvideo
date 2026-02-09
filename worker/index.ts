import VideoService from './videoService';

interface Env {
  DASHSCOPE_API_KEY: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateVideo(prompt: string, type: string, env: Env, additionalParams?: Record<string, any>) {
  const apiKey = env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is not configured");
  }

  let apiUrl = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let requestBody: any = {};

  switch(type) {
    case 't2v': // Text-to-Video
      apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2video/video-generation';
      requestBody = {
        model: 'wanx-video-v2',
        input: { prompt },
        parameters: {
          ...additionalParams,
          video_cfg: {
            duration: 5, // Default 5 seconds
            width: 1080,
            height: 1920,
            ...(additionalParams?.video_cfg || {})
          }
        }
      };
      break;
    case 'i2v': // Image-to-Video
      apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2video/video-generation';
      requestBody = {
        model: 'wanx-image-video',
        input: { 
          prompt,
          image: additionalParams?.image_url // Base64 encoded image or URL
        },
        parameters: {
          ...additionalParams,
          video_cfg: {
            duration: 5,
            width: 1080,
            height: 1920,
            ...(additionalParams?.video_cfg || {})
          }
        }
      };
      break;
    case 'r2v': // Reference-to-Video
      apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/ref2video/video-generation';
      requestBody = {
        model: 'wanx-ref-video',
        input: { 
          prompt,
          reference: additionalParams?.reference_url // Reference video or image
        },
        parameters: {
          ...additionalParams,
          video_cfg: {
            duration: 5,
            width: 1080,
            height: 1920,
            ...(additionalParams?.video_cfg || {})
          }
        }
      };
      break;
    default:
      throw new Error(`Unsupported video generation type: ${type}`);
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorData}`);
  }

  return response.json();
}

async function pollForResult(taskId: string, env: Env) {
  const apiKey = env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is not configured");
  }

  const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Polling request failed: ${response.status} ${errorData}`);
  }

  return response.json();
}

async function validateYouTubeCompliance(videoPath: string) {
  // Use the VideoService to check compliance
  return await VideoService.checkYouTubeCompliance(videoPath);
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Video generation endpoints
    if (url.pathname.startsWith("/api/video/generate")) {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = await request.json() as any;
        const { prompt, type, params } = body;

        if (!prompt || !type) {
          return new Response(JSON.stringify({ error: 'Missing required fields: prompt, type' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const result = await generateVideo(prompt, type, env, params);

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // Polling endpoint for video generation status
    if (url.pathname.startsWith("/api/video/status")) {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const taskId = url.searchParams.get('taskId');
        if (!taskId) {
          return new Response(JSON.stringify({ error: 'Missing taskId parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const result = await pollForResult(taskId, env);

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // YouTube compliance check endpoint
    if (url.pathname.startsWith("/api/video/compliance")) {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = await request.json() as any;
        const { videoPath } = body;

        if (!videoPath) {
          return new Response(JSON.stringify({ error: 'Missing videoPath parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const result = await validateYouTubeCompliance(videoPath);

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // Video editing endpoint
    if (url.pathname.startsWith("/api/video/edit")) {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = await request.json() as any;
        const { inputPath, outputPath, options } = body;

        if (!inputPath || !outputPath) {
          return new Response(JSON.stringify({ error: 'Missing required fields: inputPath, outputPath' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const success = await VideoService.processVideo(inputPath, outputPath, options);

        return new Response(JSON.stringify({
          success,
          message: success ? 'Video processed successfully' : 'Video processing failed'
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // Legacy API endpoint
    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare Video Generation API",
        endpoints: [
          "/api/video/generate - Generate video from text/image/reference",
          "/api/video/status - Check generation status",
          "/api/video/compliance - Validate YouTube compliance",
          "/api/video/edit - Edit and process videos"
        ]
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
