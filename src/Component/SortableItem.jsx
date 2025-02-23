import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash, Edit } from "lucide-react";

export const SortableItem = ({ id, task, handleDeleteTask, setEditingTask, setTaskData }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 shadow rounded-lg flex justify-between items-center mb-2 cursor-grab">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => {
          setEditingTask(task);
          setTaskData({ title: task.title, description: task.description, category: task.category });
        }} className="text-blue-500">
          <Edit size={18} />
        </button>
        <button onClick={() => handleDeleteTask(task._id)} className="text-red-500">
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
};
