"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { formatPostgresDate } from "@/lib/utils";

const TasksCard = ({
  topic,
  toggleComplete,
  handleDelete,
}: {
  topic: Topic;
  toggleComplete: ({
    taskId,
    topicId,
  }: {
    taskId: number;
    topicId: number;
  }) => Promise<void>;
  handleDelete?: (topicId: number) => void;
}) => {
  const [completionPercent, setCompletionPercent] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updatedDate, setUpdatedDate] = useState("");
  const totalTasks = tasks.length;

  const toggleCompleteTemp = (taskItemId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskItemId ? { ...task, done: !task.done } : task
    );

    setTasks(updatedTasks);
    toggleComplete({ taskId: taskItemId, topicId: topic.id });
    setUpdatedDate(formatPostgresDate(new Date().toISOString()));

    const completedCount = updatedTasks.filter((task) => task.done).length;
    setCompletedCount(completedCount);

    const completionPercent =
      updatedTasks.length > 0
        ? (completedCount / updatedTasks.length) * 100
        : 0;
    setCompletionPercent(completionPercent);
  };

  useEffect(() => {
    const formattedDate = formatPostgresDate(topic.updatedAt);
    setUpdatedDate(formattedDate);
    setTasks(topic.tasks);

    const completedCount = topic.tasks.filter((task) => task.done).length;
    setCompletedCount(completedCount);

    const completionPercent =
      topic.tasks.length > 0 ? (completedCount / topic.tasks.length) * 100 : 0;
    setCompletionPercent(completionPercent);
  }, [topic]);

  return (
    <div className="prompt_card space-y-2">
      <h2 className="text-lg font-bold mb-5">Title: {topic.title}</h2>

      <div className="space-y-1 mb-4">
        <Progress
          value={completionPercent}
          className="h-1 bg-gray-200 [&>div]:bg-orange-500"
        />
        <p className="text-xs text-muted-foreground">
          {completedCount} of {totalTasks} tasks completed
        </p>
      </div>

      {tasks.map(({ id: taskItemId, text, done }) => {
        let isCompleted = done;

        return (
          <div key={taskItemId} className="flex items-center gap-3">
            <div className="w-full flex items-center gap-2 border rounded-md px-4 py-2">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => {
                  toggleCompleteTemp(taskItemId);
                  isCompleted = !isCompleted;
                }}
              />
              <span
                className={`ml-2 text-sm font-medium ${
                  isCompleted ? "line-through text-muted-foreground" : ""
                }`}
              >
                {text}
              </span>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center w-full">
        <p
          className="font-inter text-sm orange_gradient cursor-pointer pt-2"
          onClick={() => handleDelete?.(topic.id)}
        >
          Delete
        </p>
        <p>Updated At: {updatedDate}</p>
      </div>
    </div>
  );
};

export default TasksCard;
