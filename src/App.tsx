import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cloudflareLogo from './assets/Cloudflare_Logo.svg'
import VideoGenerator from './components/VideoGenerator'
import VideoEditor from './components/VideoEditor'
import YouTubeComplianceChecker from './components/YouTubeComplianceChecker'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState('generator')

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
        <a href='https://workers.cloudflare.com/' target='_blank'>
          <img src={cloudflareLogo} className='logo cloudflare' alt='Cloudflare logo' />
        </a>
      </div>
      <h1>AI Video Generation & Editing Platform</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'generator' ? 'active' : ''}
          onClick={() => setActiveTab('generator')}
        >
          Video Generator
        </button>
        <button 
          className={activeTab === 'editor' ? 'active' : ''}
          onClick={() => setActiveTab('editor')}
        >
          Video Editor
        </button>
        <button 
          className={activeTab === 'compliance' ? 'active' : ''}
          onClick={() => setActiveTab('compliance')}
        >
          YouTube Compliance
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'generator' && <VideoGenerator />}
        {activeTab === 'editor' && <VideoEditor />}
        {activeTab === 'compliance' && <YouTubeComplianceChecker />}
      </div>
      
      <div className='card'>
        <button
          onClick={() => setCount((count) => count + 1)}
          aria-label='increment'
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
