import React from 'react';
import Navbar from '../Component/Navbar';
import { Outlet } from 'react-router-dom';


const Mainlayout = () => {
    return (
        <div>
            <Navbar></Navbar>
           
            <Outlet></Outlet>
            
        </div>
    );
};

export default Mainlayout;