"use client";

import TasksCard from "@/components/TaskCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"; // Assuming you're using shadcn/ui

const Page = () => {
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTaskList = async () => {
    try {
      const response = await axios.get("/api/tasks/user");

      if (response.data.success) {
        const data = response.data.data;
        if (data) setTopicList(data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComplete = async ({
    taskId,
    topicId,
  }: {
    taskId: number;
    topicId: number;
  }) => {
    try {
      const response = await axios.post(
        `/api/tasks/toggle-completion?taskId=${taskId}&topicId=${topicId}`
      );

      if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (topicId: number) => {
    try {
      const list = topicList.filter((topic) => topic.id !== topicId);
      setTopicList(list);

      const response = await axios.delete(`/api/topic/${topicId}`);

      if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log("An error occurred while deletion: ", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchTaskList();
  }, []);

  const filteredTopics = topicList.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-md mb-6">
        <Input
          type="text"
          placeholder="Search by topic title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:outline-none focus:ring-0 focus:border-transparent"
        />
      </div>

      {filteredTopics.length === 0 ? (
        <h1 className="text-2xl font-bold">No matching tasks</h1>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredTopics.map((topic) => (
            <TasksCard
              key={topic.id}
              topic={topic}
              toggleComplete={toggleComplete}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
