import { createBrowserRouter } from "react-router-dom";
// import App from './App.jsx'

import Mainlayout from "../Mainlayout/Mainlayout";
import Login from "../Component/Login";
import Registration from "../Component/Registration";
import TaskBoard from "../Component/TaskBoard";



    const router = createBrowserRouter([
        {
          path: "/",
          element: <Mainlayout>
            
          </Mainlayout>,
          children:[
            {
              path:'/',
              element:<TaskBoard></TaskBoard>

            },
            {
            path:'/login',
            element:<Login></Login>
          },

          
          
        ]
        },
      ]);

export default router;