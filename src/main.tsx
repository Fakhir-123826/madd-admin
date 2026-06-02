import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from "./router.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster, toast } from "react-hot-toast";
import TokenExpiryWatcher from './component/TokenExpiryWatcher';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TokenExpiryWatcher />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
