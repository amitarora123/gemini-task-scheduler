import { db } from "@/db/drizzle";
import { Task, Topic } from "@/db/schema";
import { eq } from "drizzle-orm";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ topicId: number }> }
) => {
  try {
    const { topicId } = await params;

    await db.delete(Task).where(eq(Task.topicId, topicId));
    await db.delete(Topic).where(eq(Topic.id, topicId));

    return Response.json(
      {
        success: true,
        message: "Tasks with topic deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong ",
      },
      { status: 500 }
    );
  }
};
