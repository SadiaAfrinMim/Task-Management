import React from "react";

const Modal = ({ isOpen, onClose, onSave, taskData, setTaskData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{taskData._id ? "Edit Task" : "Add Task"}</h2>

        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded mb-3"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded mb-3"
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
        />
        <select
          className="w-full p-2 border rounded mb-3"
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
          <button onClick={onSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            {taskData._id ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
