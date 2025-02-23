// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'

// import { RouterProvider } from 'react-router-dom'
// import router from './Router/Router.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//      <RouterProvider router={router} />
//   </StrictMode>,
// )


import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom'

import "./index.css";



import { Toaster } from "react-hot-toast";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AuthProvider from "./AuthProvider/AuthProvider";
import router from "./Router/Router";


const queryClient = new QueryClient();





ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <AuthProvider>
   <QueryClientProvider client={queryClient}>
 
    <RouterProvider router={router} />
    
    <Toaster position='top-right' reverseOrder={false} />
   </QueryClientProvider>
   </AuthProvider>
  </React.StrictMode>
);
