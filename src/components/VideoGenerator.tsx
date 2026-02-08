import { useState } from 'react';
import { VideoGenerationRequest, VideoGenerationResponse } from '../types';
import ApiClient from '../utils/api';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState<'t2v' | 'i2v' | 'r2v'>('t2v');
  const [imageUrl, setImageUrl] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [duration, setDuration] = useState(5);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);
  const [taskId, setTaskId] = useState('');
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setVideoUrl('');
    
    try {
      const requestBody: VideoGenerationRequest = {
        prompt,
        type: generationType,
        params: {
          video_cfg: {
            duration,
            width,
            height
          }
        }
      };

      if (generationType === 'i2v' && imageUrl) {
        requestBody.params!.image_url = imageUrl;
      }
      
      if (generationType === 'r2v' && referenceUrl) {
        requestBody.params!.reference_url = referenceUrl;
      }

      const data = await ApiClient.generateVideo(requestBody);

      if (data.taskId) {
        setTaskId(data.taskId);
        setStatus('Submitted - Processing...');
        
        // Start polling for results
        try {
          const result = await ApiClient.pollForCompletion(data.taskId);
          setStatus(result.status || 'Completed');
          if (result.videoUrl) {
            setVideoUrl(result.videoUrl);
          }
        } catch (pollErr) {
          setError(pollErr instanceof Error ? pollErr.message : 'Failed to get video status');
        }
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!taskId) {
      setError('No task ID to check');
      return;
    }

    try {
      const data = await ApiClient.getVideoStatus(taskId);

      if (data.status) {
        setStatus(data.status);
      }
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="video-generator">
      <h2>AI Video Generator</h2>
      
      <div className="form-group">
        <label htmlFor="prompt">Prompt:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to generate..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Generation Type:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="generationType"
              value="t2v"
              checked={generationType === 't2v'}
              onChange={() => setGenerationType('t2v')}
            />
            Text-to-Video
          </label>
          <label>
            <input
              type="radio"
              name="generationType"
              value="i2v"
              checked={generationType === 'i2v'}
              onChange={() => setGenerationType('i2v')}
            />
            Image-to-Video
          </label>
          <label>
            <input
              type="radio"
              name="generationType"
              value="r2v"
              checked={generationType === 'r2v'}
              onChange={() => setGenerationType('r2v')}
            />
            Reference-to-Video
          </label>
        </div>
      </div>

      {generationType === 'i2v' && (
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL for Image-to-Video"
          />
        </div>
      )}

      {generationType === 'r2v' && (
        <div className="form-group">
          <label htmlFor="referenceUrl">Reference URL:</label>
          <input
            id="referenceUrl"
            type="url"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="Enter reference video/image URL for Reference-to-Video"
          />
        </div>
      )}

      <div className="form-group">
        <label>Video Configuration:</label>
        <div className="config-row">
          <div>
            <label htmlFor="duration">Duration (seconds):</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              max="60"
            />
          </div>
          <div>
            <label htmlFor="width">Width:</label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="1"
              max="3840"
            />
          </div>
          <div>
            <label htmlFor="height">Height:</label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="1"
              max="2160"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={loading || !prompt}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Generate Video'}
      </button>

      {error && <div className="error">{error}</div>}
      
      {taskId && (
        <div className="result-section">
          <h3>Generation Status</h3>
          <p><strong>Task ID:</strong> {taskId}</p>
          <p><strong>Status:</strong> {status}</p>
          
          <button onClick={handleCheckStatus}>Refresh Status</button>
          
          {videoUrl && (
            <div className="video-preview">
              <h4>Generated Video:</h4>
              <video controls src={videoUrl} width="100%" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;