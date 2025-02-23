export const TaskForm = ({ task, setTask, handleSubmit }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Task Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <select
        value={task.category}
        onChange={(e) => setTask({ ...task, category: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="todo">To Do</option>
        <option value="inProgress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Add Task
      </button>
    </div>
  )
}
