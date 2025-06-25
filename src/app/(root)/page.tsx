"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const suggestTask = () => {
    if (topic.length < 3) return;
    setTasks([]);
    setIsLoading(true);

    let buffer = "";

    const encodedTopic = encodeURIComponent(topic);
    const eventSource = new EventSource(`/api/generate/${encodedTopic}`);

    eventSource.onmessage = (event) => {
      const char: string = event.data;
      buffer += char;

      if (buffer.endsWith("||")) {
        // Finalize the previous question
        setTasks((prev) => [...prev, ""]);
        buffer = "";
      } else {
        // Update the last question
        setTasks((prev) => {
          if (prev.length === 0) return [char];
          const updated = [...prev];
          if (char === "|") return updated;
          updated[updated.length - 1] += char;
          return updated;
        });
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsLoading(false);
    };
  };

  const handleSaveTasks = async () => {
    try {
      setIsSaving(true);
      if (!tasks.length) {
        toast.error("tasks are empty");
        return;
      }

      const response = await axios.post("/api/tasks", {
        tasks,
        topic,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setTasks([]);
      setTopic("");
    } catch (error: any) {
      console.log("error: ", error);
      toast.error("error occurred: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div>
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
          Search & Schedule
          <br />
          <span className="orange_gradient text-center">
            Structured Tasks in Seconds
          </span>
        </h1>
        <p className="desc text-center">
          Type a topic and get instant, actionable learning tasks
        </p>
      </section>

      <section className="feed">
        <form className="relative w-full flex-center">
          <input
            type="text"
            placeholder="Search for the topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="search_input peer rounded-none rounded-l-md"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              suggestTask();
            }}
            className="bg-primary-orange text-white px-3 py-2 font-bold rounded-r-md"
          >
            {isLoading ? (
              <p className="flex gap-2 items-center">
                searching <Loader2 className="animate-spin size-5" />
              </p>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </section>

      {tasks.length > 0 && (
        <div className="p-4 max-w-xl mx-auto">
          <ol className="border  p-4 rounded-lg flex flex-col gap-6 h-fit  space-y-2 min-h-[100px]">
            {tasks.map((q, idx) => (
              <li key={idx} className="animate-pulse ">
                <Button>
                  <p className="text-wrap">{q}</p>
                </Button>
              </li>
            ))}
          </ol>

          <div className="my-5 flex gap-5 items-center ">
            <button
              onClick={() => handleSaveTasks()}
              className="bg-primary-orange cursor-pointer hover:opacity-70 transition-opacity duration-200 text-white px-5 py-1.75 rounded-md font-semibold"
            >
              {isSaving ? (
                <p className="flex items-center gap-2">
                  {" "}
                  saving.... <Loader2 className="animate-spin size-5" />{" "}
                </p>
              ) : (
                <p>Save</p>
              )}
            </button>
            <Button
              onClick={() => {
                setTasks([]);
              }}
              variant="outline"
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
