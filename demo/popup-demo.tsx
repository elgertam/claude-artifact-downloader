import React, { useState } from 'react';

const PopupDemo = () => {
  const [theme, setTheme] = useState('light');
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [showDownloading, setShowDownloading] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleScan = () => {
    setShowArtifacts(true);
    setShowError(false);
    setShowDownloading(false);
  };
  
  const handleDownload = () => {
    setShowDownloading(true);
    setShowError(false);
    setTimeout(() => {
      setShowDownloading(false);
    }, 2000);
  };
  
  const handleShowError = () => {
    setShowError(!showError);
    setShowArtifacts(false);
    setShowDownloading(false);
  };
  
  const artifactsList = [
    { id: 1, title: 'React Component', type: 'application/vnd.ant.react', language: 'jsx' },
    { id: 2, title: 'Python Script', type: 'application/vnd.ant.code', language: 'python' },
    { id: 3, title: 'Project README', type: 'text/markdown', language: '' },
    { id: 4, title: 'Architecture Diagram', type: 'application/vnd.ant.mermaid', language: '' }
  ];
  
  const getReadableType = (type) => {
    const typeMap = {
      'application/vnd.ant.code': 'Code',
      'text/markdown': 'Markdown',
      'application/vnd.ant.mermaid': 'Mermaid Diagram',
      'application/vnd.ant.react': 'React Component'
    };
    
    return typeMap[type] || type;
  };
  
  return (
    <div className={`w-96 rounded-lg overflow-hidden shadow-lg border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
      <div className="p-4">
        <h1 className="text-xl font-semibold text-center mb-4">Claude Artifact Downloader</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleScan}
            className={`flex-1 px-4 py-2 rounded ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
          >
            Scan for Artifacts
          </button>
          <button
            onClick={handleDownload}
            disabled={!showArtifacts}
            className={`flex-1 px-4 py-2 rounded ${!showArtifacts ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
          >
            Download All
          </button>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Enhanced Mode</span>
            <div className={`w-10 h-5 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} relative cursor-pointer`}>
              <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Dark Mode</span>
            <div
              onClick={toggleTheme}
              className={`w-10 h-5 rounded-full ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-300'} relative cursor-pointer`}
            >
              <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {showDownloading && (
            <div className="w-5 h-5 border-2 rounded-full border-t-transparent animate-spin border-indigo-500"></div>
          )}
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {showDownloading ? 'Downloading artifacts...' : 
             showArtifacts ? 'Found 4 artifacts in this conversation.' : 
             'Click "Scan for Artifacts" to begin'}
          </p>
        </div>
        
        {showError && (
          <div className={`p-3 mb-4 rounded ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
            <p>Could not connect to Claude API. Please refresh the page and try again.</p>
          </div>
        )}
        
        {showArtifacts && (
          <div className={`max-h-64 overflow-y-auto border rounded mb-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {artifactsList.map(artifact => (
              <div key={artifact.id} className={`p-3 flex justify-between items-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div>
                  <div className="font-medium">{artifact.title}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {getReadableType(artifact.type)}
                    {artifact.language && ` (${artifact.language.toUpperCase()})`}
                  </div>
                </div>
                <input type="checkbox" checked className="w-5 h-5 accent-indigo-500" />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 mb-2 justify-center">
          <button
            onClick={handleShowError}
            className={`px-3 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Toggle Error
          </button>
        </div>
        
        <div className="text-center text-xs opacity-70">
          v1.0.0 | <a href="#" className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>GitHub</a>
        </div>
      </div>
    </div>
  );
};

export default PopupDemo;
