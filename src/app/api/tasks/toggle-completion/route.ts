import { db } from "@/db/drizzle";
import { Task, Topic } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const taskId = Number(searchParams.get("taskId"));
    const topicId = Number(searchParams.get("topicId"));

    const taskArray = await db.select().from(Task).where(eq(Task.id, taskId));
    const topicArray = await db
      .select()
      .from(Topic)
      .where(eq(Topic.id, topicId));

    const task = taskArray[0];
    const topic = topicArray[0];

    if (!task || !topic) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }
    await db.update(Task).set({ done: !task.done }).where(eq(Task.id, taskId));
    await db
      .update(Topic)
      .set({ updatedAt: new Date() })
      .where(eq(Topic.id, topicId));

    return Response.json(
      {
        success: true,
        message: "Task updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "An error occurred while toggling task completion status: ",
      error
    );
    return Response.json(
      {
        success: false,
        message: "An Error occurred while updating task",
      },
      { status: 500 }
    );
  }
};
