import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BlogApp } from './BlogApp';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/contexts/AuthProvider';
import './styles/custom.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BlogApp />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

