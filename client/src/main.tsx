import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { Provider } from "react-redux"; 
import { Toaster } from "react-hot-toast";
import { store } from './store/store.ts'
import { BrowserRouter } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <Provider store={store}><App /></Provider>
  <Toaster position="top-right" reverseOrder={false} />


    </BrowserRouter>      
       
         </ClerkProvider>
   
  </StrictMode>,
)
