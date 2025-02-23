import React from 'react';

const EditTaskModal = ({ isOpen, onClose, taskData, setTaskData, handleTaskSave }) => {
    if (!isOpen) return null; // Modal বন্ধ থাকলে কিছুই রিটার্ন করবে না
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Edit Task</h2>
          
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 border rounded mb-2"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          />
          
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded mb-2"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          />
          
          <select
            className="w-full p-2 border rounded mb-4"
            value={taskData.category}
            onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button onClick={handleTaskSave} className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default EditTaskModal;