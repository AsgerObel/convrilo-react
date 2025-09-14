import React, { useState, useRef } from 'react';
import './FileConverter.css';

function FileConverter() {
  const [fileQueue, setFileQueue] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progressList, setProgressList] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      extension: file.name.split('.').pop().toLowerCase(),
      suggestedFormat: getSuggestedFormat(file),
      settings: getDefaultSettings(file),
      showSettings: false
    }));
    setFileQueue([...fileQueue, ...newFiles]);
  };

  const getSuggestedFormat = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const type = file.type;

    if (type.startsWith('image/')) {
      if (ext === 'heic' || ext === 'heif') return 'jpg';
      if (ext === 'png') return 'webp';
      if (ext === 'jpg' || ext === 'jpeg') return 'webp';
      return 'jpg';
    }
    if (type === 'application/pdf') return 'jpg';
    if (type.startsWith('video/')) return 'mp3';
    if (type.startsWith('audio/')) return 'mp3';
    return ext;
  };

  const getDefaultSettings = (file) => {
    const type = file.type;

    if (type.startsWith('image/')) {
      return {
        quality: 85,
        dimensions: 'original',
        colorSpace: 'rgb',
        dpi: 72,
        preserveMetadata: false
      };
    }
    if (type === 'application/pdf') {
      return {
        pages: 'all',
        compression: 'medium',
        password: '',
        ocr: false
      };
    }
    if (type.startsWith('video/')) {
      return {
        resolution: 'original',
        bitrate: 'auto',
        codec: 'h264',
        trimStart: '',
        trimEnd: ''
      };
    }
    if (type.startsWith('audio/')) {
      return {
        bitrate: '320',
        sampleRate: '44100',
        channels: 'stereo',
        volume: 100
      };
    }
    return {};
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId) => {
    setFileQueue(fileQueue.filter(f => f.id !== fileId));
  };

  const clearAllFiles = () => {
    setFileQueue([]);
  };

  const toggleSettings = (fileId) => {
    setFileQueue(fileQueue.map(f =>
      f.id === fileId ? { ...f, showSettings: !f.showSettings } : f
    ));
  };

  const updateFileFormat = (fileId, format) => {
    setFileQueue(fileQueue.map(f =>
      f.id === fileId ? { ...f, suggestedFormat: format } : f
    ));
  };

  const updateFileSetting = (fileId, setting, value) => {
    setFileQueue(fileQueue.map(f =>
      f.id === fileId ? { ...f, settings: { ...f.settings, [setting]: value } } : f
    ));
  };

  const convertAllFiles = async () => {
    setIsConverting(true);
    setProgressList(fileQueue.map((file, index) => ({
      id: file.id,
      name: file.name,
      progress: 0,
      status: 'Waiting...'
    })));

    for (let i = 0; i < fileQueue.length; i++) {
      const file = fileQueue[i];
      setProgressList(prev => prev.map(p =>
        p.id === file.id ? { ...p, status: 'Converting...' } : p
      ));

      // Simulate conversion progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgressList(prev => prev.map(p =>
          p.id === file.id ? { ...p, progress } : p
        ));
      }

      setProgressList(prev => prev.map(p =>
        p.id === file.id ? { ...p, status: 'Complete' } : p
      ));

      // Simulate file download
      downloadFile(file);
    }
  };

  const downloadFile = (fileData) => {
    const blob = new Blob([`Converted ${fileData.name} to ${fileData.suggestedFormat}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileData.name.split('.')[0]}.${fileData.suggestedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    return '📄';
  };

  const getFormatOptions = (type) => {
    if (type.startsWith('image/')) {
      return ['jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
    } else if (type === 'application/pdf') {
      return ['jpg', 'png', 'pdf', 'txt', 'docx'];
    } else if (type.startsWith('video/')) {
      return ['mp4', 'avi', 'mov', 'mkv', 'mp3', 'wav'];
    } else if (type.startsWith('audio/')) {
      return ['mp3', 'wav', 'flac', 'aac', 'ogg'];
    }
    return [];
  };

  return (
    <main className="main-container">
      {fileQueue.length === 0 && !isConverting ? (
        <>
          <div
            className={`upload-zone ${isDragging ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-content">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3 className="upload-title">Drop files here or click to browse</h3>
              <p className="upload-subtitle">Support 40+ formats • Process up to 100 files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileInput}
              />
            </div>
          </div>

          <div className="tool-categories">
            <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
              <span className="tool-icon">🖼️</span>
              Images
            </button>
            <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
              <span className="tool-icon">📄</span>
              PDFs
            </button>
            <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
              <span className="tool-icon">🔗</span>
              QR/Link
            </button>
            <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
              <span className="tool-icon">🎥</span>
              Video
            </button>
            <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>
              <span className="tool-icon">🎵</span>
              Audio
            </button>
          </div>
        </>
      ) : null}

      {fileQueue.length > 0 && !isConverting ? (
        <div className="file-queue">
          <div className="queue-header">
            <h3>Files to Convert</h3>
            <div className="queue-actions">
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                Add More Files
              </button>
              <button className="btn-secondary" onClick={clearAllFiles}>
                Clear All
              </button>
            </div>
          </div>
          <div className="file-list">
            {fileQueue.map(fileData => (
              <div key={fileData.id}>
                <div className="file-item">
                  <div className="file-info">
                    <div className="file-icon">{getFileIcon(fileData.type)}</div>
                    <div className="file-details">
                      <h4>{fileData.name}</h4>
                      <p>{formatFileSize(fileData.size)} • {fileData.extension.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="conversion-arrow">→</div>
                  <select
                    className="format-selector"
                    value={fileData.suggestedFormat}
                    onChange={(e) => updateFileFormat(fileData.id, e.target.value)}
                  >
                    {getFormatOptions(fileData.type).map(format => (
                      <option key={format} value={format}>{format.toUpperCase()}</option>
                    ))}
                  </select>
                  <div className="file-actions">
                    <button
                      className="action-btn settings-btn"
                      onClick={() => toggleSettings(fileData.id)}
                      title="Advanced Settings"
                    >
                      ⚙️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => removeFile(fileData.id)}
                      title="Remove File"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {fileData.showSettings && (
                  <div className="settings-panel">
                    <div className="settings-grid">
                      {fileData.type.startsWith('image/') && (
                        <>
                          <div className="setting-group">
                            <label>Quality</label>
                            <div className="slider-container">
                              <input
                                type="range"
                                className="slider"
                                min="1"
                                max="100"
                                value={fileData.settings.quality}
                                onChange={(e) => updateFileSetting(fileData.id, 'quality', e.target.value)}
                              />
                              <input
                                type="number"
                                className="slider-value"
                                value={fileData.settings.quality}
                                min="1"
                                max="100"
                                onChange={(e) => updateFileSetting(fileData.id, 'quality', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="setting-group">
                            <label>Dimensions</label>
                            <select
                              className="setting-input"
                              value={fileData.settings.dimensions}
                              onChange={(e) => updateFileSetting(fileData.id, 'dimensions', e.target.value)}
                            >
                              <option value="original">Original</option>
                              <option value="1920x1080">1920x1080</option>
                              <option value="1280x720">1280x720</option>
                              <option value="800x600">800x600</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="queue-footer">
            <label className="apply-all-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Apply settings to all similar files
            </label>
            <button className="btn-primary" onClick={convertAllFiles}>
              Convert All
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFileInput}
          />
        </div>
      ) : null}

      {isConverting && (
        <div className="progress-section">
          <h3>Converting Files</h3>
          <div className="progress-list">
            {progressList.map(item => (
              <div key={item.id} className="progress-item">
                <div className="file-info">
                  <span>{item.name}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                </div>
                <div className="progress-status">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default FileConverter;