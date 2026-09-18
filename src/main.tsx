import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { cms } from './api/cms'
import './index.css'

// The cover story carries the page's largest image, and its URL only exists
// once this response arrives — so nothing can even ask for that image until
// then. Starting the request here takes React's first render and effect pass
// off the front of that chain, and puts it at the CMS ahead of the dozen
// requests the rest of the home page makes. HeroSection still asks for it the
// same way it always has: in-flight requests are deduplicated by URL, so its
// call joins this one instead of making a second.
if (window.location.pathname === '/') {
  cms.coverStory.fetch().catch(() => {
    /* HeroSection reports the failure through its own call. */
  })
}

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
