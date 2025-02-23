// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { DndContext, closestCorners, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
// import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { toast } from "react-hot-toast";
// import { Trash, Edit } from 'lucide-react';
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
//   const [taskData, setTaskData] = useState({ title: "", description: "", category: "todo" });
//   const [editingTask, setEditingTask] = useState(null);

//   const sensors = useSensors(useSensor(PointerSensor));

//   useEffect(() => {
//     fetchTasks();
    
//     const handleTaskUpdate = (updatedTask) => {
//       setTasks(prev => ({
//         ...prev,
//         [updatedTask.category]: prev[updatedTask.category].map(task => 
//           task._id === updatedTask._id ? updatedTask : task
//         )
//       }));
//     };

//     socket.on("taskAdded", (newTask) => {
//       setTasks(prev => ({
//         ...prev,
//         [newTask.category]: [...prev[newTask.category], newTask]
//       }));
//     });

//     socket.on("taskUpdated", handleTaskUpdate);
//     socket.on("taskMoved", handleTaskUpdate);
//     socket.on("taskDeleted", (deletedTaskId) => {
//       setTasks(prev => ({
//         todo: prev.todo.filter(task => task._id !== deletedTaskId),
//         inProgress: prev.inProgress.filter(task => task._id !== deletedTaskId),
//         done: prev.done.filter(task => task._id !== deletedTaskId)
//       }));
//     });

//     return () => {
//       socket.off("taskAdded");
//       socket.off("taskUpdated");
//       socket.off("taskMoved");
//       socket.off("taskDeleted");
//     };
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:5000/tasks");
//       const categorizedTasks = data.reduce((acc, task) => {
//         acc[task.category].push(task);
//         return acc;
//       }, { todo: [], inProgress: [], done: [] });
//       setTasks(categorizedTasks);
//     } catch (error) {
//       toast.error("Failed to load tasks!");
//     }
//   };

//   const handleTaskSave = async () => {
//     if (!taskData.title.trim()) return toast.error("Task title is required!");
//     try {
//       if (editingTask) {
//         await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, taskData);
//         socket.emit("taskUpdated", taskData);
//         setEditingTask(null);
//         toast.success("Task updated successfully!");
//       } else {
//         const { data: newTask } = await axios.post("http://localhost:5000/tasks", taskData);
//         socket.emit("taskAdded", newTask);
//         toast.success("Task added successfully!");
//       }
//       setTaskData({ title: "", description: "", category: "todo" });
//     } catch (error) {
//       toast.error("Failed to save task!");
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await axios.delete(`http://localhost:5000/tasks/${taskId}`);
//       socket.emit("taskDeleted", taskId);
//       toast.success("Task deleted successfully!");
//     } catch (error) {
//       toast.error("Failed to delete task!");
//     }
//   };

  

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;
//     if (!over) return;
  
//     const taskId = active.id;
//     const sourceCategory = active.data.current?.category;
//     const destinationCategory = over.data.current?.category;
  
//     if (!sourceCategory || !destinationCategory || sourceCategory === destinationCategory) return;
  
//     // **Optimistic UI Update - Move Task Instantly**
//     setTasks((prev) => {
//       const task = prev[sourceCategory].find(task => task._id === taskId);
//       if (!task) return prev;
  
//       const updatedTask = { ...task, category: destinationCategory };
  
//       return {
//         ...prev,
//         [sourceCategory]: prev[sourceCategory].filter(task => task._id !== taskId),
//         [destinationCategory]: [...prev[destinationCategory], updatedTask]
//       };
//     });
  
//     try {
//       // **Update Database**
//       await axios.put(`http://localhost:5000/tasks/${taskId}`, { category: destinationCategory });
  
//       // **Emit real-time update**
//       socket.emit("taskMoved", { _id: taskId, category: destinationCategory });
//     } catch (error) {
//       toast.error("Failed to move task!");
//       fetchTasks(); // **Rollback on error**
//     }
//   };


  
  
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>
//       <div className="mb-6 flex gap-4">
//         <input
//           type="text"
//           placeholder="Task Title"
//           className="p-2 border rounded w-1/3"
//           value={taskData.title}
//           onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           className="p-2 border rounded w-1/3"
//           value={taskData.description}
//           onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
//         />
//         <select
//           className="p-2 border rounded"
//           value={taskData.category}
//           onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
//         >
//           <option value="todo">To Do</option>
//           <option value="inProgress">In Progress</option>
//           <option value="done">Done</option>
//         </select>
//         <button
//           onClick={handleTaskSave}
//           className="p-2 bg-blue-500 text-white rounded"
//         >
//           {editingTask ? "Update" : "Add"}
//         </button>
//       </div>
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCorners}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {Object.entries(tasks).map(([category, categoryTasks]) => (
//             <div key={category} className="bg-gray-50 p-4 rounded-lg shadow">
//               <h2 className="font-semibold text-lg text-gray-700 mb-4">
//                 {category === "todo" ? "To Do" : 
//                  category === "inProgress" ? "In Progress" : "Done"}
//               </h2>
//               <SortableContext 
//                 items={categoryTasks.map((task) => task._id)}
//                 strategy={verticalListSortingStrategy}
//               >
//                 {categoryTasks.map((task) => (
//                   <div
//                     key={task._id}
//                     className="p-4 bg-white shadow rounded-lg flex justify-between items-center mb-2"
//                     data-id={task._id}
//                     data-category={category}
//                   >
//                     <div>
//                       <h3 className="font-bold text-lg">{task.title}</h3>
//                       <p className="text-gray-600">{task.description}</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setEditingTask(task);
//                           setTaskData({
//                             title: task.title,
//                             description: task.description,
//                             category: task.category
//                           });
//                         }}
//                         className="text-blue-500"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteTask(task._id)}
//                         className="text-red-500"
//                       >
//                         <Trash size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </SortableContext>
//             </div>
//           ))}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default TaskBoard;













"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-hot-toast";
import { Trash, Edit } from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ItemType = "TASK";

const TaskBoard = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [taskData, setTaskData] = useState({ title: "", description: "", category: "todo" });
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

  const moveTask = async (task, newCategory) => {
    try {
      const { data: updatedTask } = await axios.put(`http://localhost:5000/tasks/${task._id}`, { category: newCategory });
      setTasks((prev) => ({
        ...prev,
        [task.category]: prev[task.category].filter((t) => t._id !== task._id),
        [newCategory]: [...prev[newCategory], updatedTask],
      }));
      socket.emit("taskMoved", updatedTask);
    } catch (error) {
      toast.error("Failed to move task!");
      fetchTasks();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Task Title"
            className="p-2 border rounded w-1/3"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded w-1/3"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={taskData.category}
            onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={handleTaskSave} className="p-2 bg-blue-500 text-white rounded">
            {editingTask ? "Update" : "Add"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <h2 className="font-semibold text-lg text-gray-700 mb-4">{category}</h2>
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
    </div>
  );
};

export default TaskBoard;
