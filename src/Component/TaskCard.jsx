import { useState } from "react";
import { useDrag } from "react-dnd";
import { Task } from "./TaskBoard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  return (
    <Card
      ref={drag}
      className={`${isDragging ? "opacity-50" : ""} cursor-move`}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Task title"
            />
            <Textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Task description"
            />
          </div>
        ) : (
          <>
            <h3 className="font-semibold mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave} size="sm" variant="outline">
              <Check className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button onClick={handleCancel} size="sm" variant="outline">
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleEdit} size="sm" variant="outline">
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button onClick={() => onDelete(task.id)} size="sm" variant="outline" className="text-red-500">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
