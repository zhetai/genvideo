import { useState } from 'react';
import type { ComplianceRequest, ComplianceResponse } from '../types';
import ApiClient from '../utils/api';

const YouTubeComplianceChecker = () => {
  const [videoPath, setVideoPath] = useState('');
  const [complianceResult, setComplianceResult] = useState<ComplianceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckCompliance = async () => {
    setLoading(true);
    setError('');
    setComplianceResult(null);
    
    try {
      const requestBody: ComplianceRequest = {
        videoPath
      };

      const data = await ApiClient.checkCompliance(requestBody);

      if (data.error) {
        setError(data.error);
      } else {
        setComplianceResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compliance-checker">
      <h2>YouTube Compliance Checker</h2>
      
      <div className="form-group">
        <label htmlFor="videoPath">Video URL/Path:</label>
        <input
          id="videoPath"
          type="url"
          value={videoPath}
          onChange={(e) => setVideoPath(e.target.value)}
          placeholder="Enter the URL/path to the video to check"
        />
        <p className="help-text">
          Enter the URL or path to your video to check if it complies with YouTube's requirements.
        </p>
      </div>

      <button 
        onClick={handleCheckCompliance} 
        disabled={loading || !videoPath}
        className="check-btn"
      >
        {loading ? 'Checking...' : 'Check Compliance'}
      </button>

      {error && <div className="error">{error}</div>}
      
      {complianceResult && (
        <div className="result-section">
          <h3>Compliance Result: 
            <span className={complianceResult.compliant ? 'compliant-status' : 'non-compliant-status'}>
              {complianceResult.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </span>
          </h3>
          
          {complianceResult.issues.length > 0 && (
            <div className="issues-section">
              <h4>Issues Found:</h4>
              <ul>
                {complianceResult.issues.map((issue, index) => (
                  <li key={index} className="issue-item">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {complianceResult.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h4>Recommendations:</h4>
              <ul>
                {complianceResult.recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {!complianceResult.compliant && complianceResult.issues.length === 0 && (
            <p>No specific issues found, but compliance could not be verified.</p>
          )}
        </div>
      )}
      
      <div className="youtube-guidelines">
        <h3>YouTube Video Requirements:</h3>
        <ul>
          <li><strong>Resolution:</strong> Up to 1080p for standard definition, up to 4K for high definition</li>
          <li><strong>Frame Rate:</strong> Up to 60fps (30fps recommended for broader compatibility)</li>
          <li><strong>Aspect Ratio:</strong> 16:9 recommended (acceptable range 4:3 to 21:9)</li>
          <li><strong>Duration:</strong> Under 15 minutes for Shorts, up to 12 hours for regular uploads (account dependent)</li>
          <li><strong>File Size:</strong> Maximum 128GB</li>
          <li><strong>Format:</strong> MP4, MOV, AVI, WMV, FLV, MPEG-PS, WebM, M4V, 3GP</li>
        </ul>
      </div>
    </div>
  );
};

export default YouTubeComplianceChecker;