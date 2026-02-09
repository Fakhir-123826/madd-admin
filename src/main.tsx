import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './screens/Login.tsx'
import Signup from './screens/Signup.tsx'
import ForgotPassword from './screens/ForgotPassword.tsx'
import EnterOTP from './screens/EnterOTP.tsx'
import Dashboard from './screens/Dashboard.tsx'
import Layout from './shear/Layout.tsx'
import StoreList from './screens/Store/StoreList.tsx'


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {path : "/" , element : <Dashboard/>},
      {path : "/store" , element : <StoreList/>}
    ]
  },
  { path: "/log", element: <Login /> },
  { path: "/otp", element: <EnterOTP /> },
  { path: "/pass", element: <ForgotPassword /> },
  { path: "/ddd", element: <Dashboard /> },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
)
