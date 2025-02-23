import React from 'react';
import Navbar from '../Component/Navbar';
import { Outlet } from 'react-router-dom';
import TaskBoard from '../Component/Taskboard';

const Mainlayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <TaskBoard></TaskBoard>
            <Outlet></Outlet>
            
        </div>
    );
};

export default Mainlayout;