import { useDraggable } from "@dnd-kit/core"
import axios from "axios"
import { Trash, Edit } from "lucide-react"
import toast from "react-hot-toast"

export const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task._id,
    data: { category: task.category },
  })

  
    
   

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
    >
      <div>
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleUpdateTask(task)} className="text-blue-500">
          <Edit size={18} />
        </button>
        <button onClick={() => handleDeleteTask(task._id)} className="text-red-500">
          <Trash size={18} />
        </button>
      </div>
    </div>
  )
}
