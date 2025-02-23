













"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-hot-toast";
import { Trash, Edit,  Clock } from "lucide-react";
import io from "socket.io-client";
import { format } from "date-fns";

const socket = io("http://localhost:5000");

const ItemType = "TASK";

const TaskBoard = () => {
  const [tasks, setTasks] = useState({ 
    todo: [], 
    inProgress: [], 
    done: [] 
  });
  
  const [taskData, setTaskData] = useState({ 
    title: "", 
    description: "", 
    category: "todo", 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  });
  
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();

    const handleTaskUpdate = (updatedTask) => {
      setTasks((prev) => ({
        ...prev,
        [updatedTask.category]: prev[updatedTask.category].map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        ),
      }));
    };

    socket.on("taskAdded", (newTask) => {
      setTasks((prev) => ({
        ...prev,
        [newTask.category]: [...prev[newTask.category], newTask],
      }));
    });

    socket.on("taskUpdated", handleTaskUpdate);
    socket.on("taskMoved", handleTaskUpdate);
    socket.on("taskDeleted", (deletedTaskId) => {
      setTasks((prev) => ({
        todo: prev.todo.filter((task) => task._id !== deletedTaskId),
        inProgress: prev.inProgress.filter((task) => task._id !== deletedTaskId),
        done: prev.done.filter((task) => task._id !== deletedTaskId),
      }));
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskMoved");
      socket.off("taskDeleted");
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/tasks");
      const categorizedTasks = data.reduce(
        (acc, task) => {
          acc[task.category].push(task);
          return acc;
        },
        { todo: [], inProgress: [], done: [] }
      );
      setTasks(categorizedTasks);
    } catch (error) {
      toast.error("Failed to load tasks!");
    }
  };

  const handleTaskSave = async () => {
    if (!taskData.title.trim()) return toast.error("Task title is required!");
    try {
      if (editingTask) {
        const { data: updatedTask } = await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, taskData);
        socket.emit("taskUpdated", updatedTask);
        setEditingTask(null);
        toast.success("Task updated successfully!");
      } else {
        const { data: newTask } = await axios.post("http://localhost:5000/tasks", taskData);
        socket.emit("taskAdded", newTask);
        toast.success("Task added successfully!");
      }
      setTaskData({ title: "", description: "", category: "todo" });
    } catch (error) {
      toast.error("Failed to save task!");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      socket.emit("taskDeleted", taskId);
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task!");
    }
  };

  // const moveTask = async (task, newCategory) => {
  //   try {
  //     const { data: updatedTask } = await axios.put(`http://localhost:5000/tasks/${task._id}`, { category: newCategory });
  //     setTasks((prev) => ({
  //       ...prev,
  //       [task.category]: prev[task.category].filter((t) => t._id !== task._id),
  //       [newCategory]: [...prev[newCategory], updatedTask],
  //     }));
  //     socket.emit("taskMoved", updatedTask);
  //   } catch (error) {
  //     toast.error("Failed to move task!");
  //     fetchTasks();
  //   }
  // };
  const moveTask = async (task, newCategory) => {
    try {
      // লোকালি আপডেট (Optimistic UI Update)
      setTasks((prev) => {
        const updatedPrevCategory = prev[task.category].filter((t) => t._id !== task._id);
        const updatedNewCategory = [{ ...task, category: newCategory }, ...prev[newCategory]];
        
        return {
          ...prev,
          [task.category]: updatedPrevCategory,
          [newCategory]: updatedNewCategory,
        };
      });
  
      // সার্ভারে আপডেট পাঠানো
      const { data: updatedTask } = await axios.put(`http://localhost:5000/tasks/${task._id}`, { category: newCategory });
  
      // সার্ভার থেকে আপডেট এলে নিশ্চিত করা
      socket.emit("taskMoved", updatedTask);
  
    } catch (error) {
      toast.error("Failed to move task!");
      fetchTasks(); // ব্যাকআপ হিসেবে পুরো ডাটা আবার লোড করো
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
  <h1 className="text-4xl font-extrabold text-gray-800 mb-6 drop-shadow-md">📌 Task <span className="text-yellow-400">Manager</span></h1>

  <div className="mb-6 lg:flex item-center justify-center gap-4 space-y-3 bg-white shadow-lg p-6 rounded-2xl w-full max-w-7xl">
    {/* Task Title */}
    <input
      type="text"
      placeholder="Enter Task Title (max 50 chars)"
      className="p-3 border rounded-full w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
      value={taskData.title}
      onChange={(e) => {
        if (e.target.value.length <= 50) {
          setTaskData({ ...taskData, title: e.target.value });
        }
      }}
    />
    
    {/* Task Description */}
    <input
      type="text"
      placeholder="Enter Task Description (max 200 chars)"
      className="p-3 border rounded-full w-full md:w-2/3 focus:ring-2 focus:ring-blue-400 outline-none"
      value={taskData.description}
      onChange={(e) => {
        if (e.target.value.length <= 200) {
          setTaskData({ ...taskData, description: e.target.value });
        }
      }}
    />
    
    {/* Task Category */}
    <select
      className="p-3 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
      value={taskData.category}
      onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
    >
      <option value="todo">📝 To Do</option>
      <option value="inProgress">⏳ In Progress</option>
      <option value="done">✅ Done</option>
    </select>

    {/* Add / Update Button */}
    <button
  onClick={handleTaskSave}
  className={` p-3 ml-2  whitespace-nowrap rounded-full shadow-md hover:scale-105 transition-transform ${
    editingTask
      ? "bg-yellow-300 text-black"
      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
  }`}
>
  {editingTask ? "Update Task" : "Add Task"}
</button>

  </div>

  {/* Task Columns */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
    {Object.entries(tasks).map(([category, categoryTasks]) => (
      <TaskColumn
        key={category}
        category={category}
        tasks={categoryTasks}
        moveTask={moveTask}
        onDelete={handleDeleteTask}
        setEditingTask={setEditingTask}
        setTaskData={setTaskData}
      />
    ))}
  </div>
</div>

    </DndProvider>
  );
};

const TaskColumn = ({ category, tasks, moveTask, onDelete, setEditingTask, setTaskData }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveTask(item.task, category),
  });

  return (
    <div ref={drop} className="bg-gray-50 p-4 rounded-lg shadow min-h-[200px]">
      <h2
  className={`font-semibold text-2xl mb-4 ${
    category === "todo"
      ? "text-blue-600"
      : category === "inProgress"
      ? "text-yellow-600"
      : "text-green-600"
  }`}
>
  {category === "todo"
    ? "📝 To Do"
    : category === "inProgress"
    ? "⏳ In Progress"
    : "✅ Done"}
</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          handleDeleteTask={onDelete}
          setEditingTask={setEditingTask}
          setTaskData={setTaskData}
        />
      ))}
    </div>
  );
};

const TaskCard = ({ task, handleDeleteTask, setEditingTask, setTaskData }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-4 bg-white shadow rounded-lg mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{task.title}</span>
        <div className="flex gap-2">
          <Trash
            className="cursor-pointer text-red-500 hover:text-red-700"
            size={18}
            onClick={() => handleDeleteTask(task._id)}
          />
          <Edit
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            size={18}
            onClick={() => {
              setEditingTask(task);
              setTaskData({
                title: task.title,
                description: task.description,
                category: task.category,
              });
            }}
          /> 



        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
      )}
   
 {task.createdAt  &&  (<div className="flex items-center justify-start gap-2 mt-3 bg-yellow-100 border border-yellow-300 rounded-full  w-50 text-sm text-yellow-700 shadow-sm"><Clock size={18} className="text-yellow-500" />
  <span>
    {task.createdAt ? format(new Date(task.createdAt), "PPpp") : "N/A"}
  </span> </div>)
 }


    </div>
  );
};

export default TaskBoard;
