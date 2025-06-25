import { db } from "@/db/drizzle";
import { Task, Topic } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) => {
  try {
    const { id } = await params;

    const response = await db
      .select()
      .from(Task)
      .where(eq(Topic.id, id))
      .leftJoin(Topic, eq(Task.topicId, Topic.id));

    return Response.json({
      data: response,
      success: true,
      message: "task fetched successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

