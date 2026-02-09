import { useState } from 'react';
import { VideoEditOptions, VideoEditRequest } from '../types';
import ApiClient from '../utils/api';

const VideoEditor = () => {
  const [inputPath, setInputPath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [removeAudio, setRemoveAudio] = useState(false);
  const [addSubtitles, setAddSubtitles] = useState(false);
  const [watermarkPath, setWatermarkPath] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');
  const [targetResolution, setTargetResolution] = useState('1080p');
  const [targetFrameRate, setTargetFrameRate] = useState(30);
  const [durationLimit, setDurationLimit] = useState(60);
  const [editedVideoUrl, setEditedVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEdit = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setEditedVideoUrl('');
    
    try {
      const editOptions: VideoEditOptions = {
        removeAudio,
        addSubtitles,
        ...(watermarkPath && { watermarkPath, watermarkPosition }),
        targetResolution,
        targetFrameRate,
        durationLimit: durationLimit > 0 ? durationLimit : undefined
      };

      const requestBody: VideoEditRequest = {
        inputPath,
        outputPath: outputPath || `${inputPath}_edited`,
        options: editOptions
      };

      const data = await ApiClient.editVideo(requestBody);

      if (data.success) {
        setSuccessMessage(data.message);
        // In a real implementation, we would receive the edited video URL
        setEditedVideoUrl(inputPath); // Using original as placeholder
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-editor">
      <h2>Video Editor</h2>
      
      <div className="form-group">
        <label htmlFor="inputPath">Input Video URL/Path:</label>
        <input
          id="inputPath"
          type="url"
          value={inputPath}
          onChange={(e) => setInputPath(e.target.value)}
          placeholder="Enter the URL/path to the video to edit"
        />
      </div>

      <div className="form-group">
        <label htmlFor="outputPath">Output Path (optional):</label>
        <input
          id="outputPath"
          type="text"
          value={outputPath}
          onChange={(e) => setOutputPath(e.target.value)}
          placeholder="Where to save the edited video (auto-generated if empty)"
        />
      </div>

      <div className="form-group">
        <label>Editing Options:</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={removeAudio}
              onChange={(e) => setRemoveAudio(e.target.checked)}
            />
            Remove Audio Track
          </label>
          <label>
            <input
              type="checkbox"
              checked={addSubtitles}
              onChange={(e) => setAddSubtitles(e.target.checked)}
            />
            Add Subtitles (Coming Soon)
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="watermarkPath">Watermark Image URL:</label>
        <input
          id="watermarkPath"
          type="url"
          value={watermarkPath}
          onChange={(e) => setWatermarkPath(e.target.value)}
          placeholder="Enter URL to watermark image (optional)"
        />
        {watermarkPath && (
          <div className="sub-options">
            <label>Watermark Position:</label>
            <select
              value={watermarkPosition}
              onChange={(e) => setWatermarkPosition(e.target.value)}
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Video Specifications:</label>
        <div className="config-row">
          <div>
            <label htmlFor="targetResolution">Target Resolution:</label>
            <select
              id="targetResolution"
              value={targetResolution}
              onChange={(e) => setTargetResolution(e.target.value)}
            >
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="1440p">1440p</option>
              <option value="4K">4K</option>
            </select>
          </div>
          <div>
            <label htmlFor="targetFrameRate">Target Frame Rate:</label>
            <input
              id="targetFrameRate"
              type="number"
              value={targetFrameRate}
              onChange={(e) => setTargetFrameRate(Number(e.target.value))}
              min="1"
              max="120"
            />
          </div>
          <div>
            <label htmlFor="durationLimit">Duration Limit (seconds, 0 for none):</label>
            <input
              id="durationLimit"
              type="number"
              value={durationLimit}
              onChange={(e) => setDurationLimit(Number(e.target.value))}
              min="0"
              max="900" // 15 minutes max
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleEdit} 
        disabled={loading || !inputPath}
        className="edit-btn"
      >
        {loading ? 'Editing...' : 'Edit Video'}
      </button>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      
      {editedVideoUrl && (
        <div className="video-preview">
          <h3>Edited Video Preview:</h3>
          <video controls src={editedVideoUrl} width="100%" />
        </div>
      )}
    </div>
  );
};

export default VideoEditor;