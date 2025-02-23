import { createBrowserRouter } from "react-router-dom";
// import App from './App.jsx'

import Mainlayout from "../Mainlayout/Mainlayout";
import Login from "../Component/Login";
import Registration from "../Component/Registration";



    const router = createBrowserRouter([
        {
          path: "/",
          element: <Mainlayout></Mainlayout>,
          children:[{
            path:'/login',
            element:<Login></Login>
          },
        {
          path:'/register',
          element:<Registration></Registration>
        }
        ]
        },
      ]);

export default router;