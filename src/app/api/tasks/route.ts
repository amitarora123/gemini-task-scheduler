import { getCurrentUser } from "@/actions/auth.action";
import { db } from "@/db/drizzle";
import { Task, Topic } from "@/db/schema";

export const POST = async (req: Request) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "UNAUTHORIZED ACCESS",
        },
        { status: 400 }
      );
    }
    const { tasks, topic }: { tasks: string[]; topic: string } =
      await req.json();

    const createdTopic = await db
      .insert(Topic)
      .values({
        title: topic,
        userId: user.id,
      })
      .returning();

    for (const item of tasks) {
      if (!item.trim()) continue;

      await db
        .insert(Task)
        .values({
          text: item,
          topicId: createdTopic[0].id,
        })
        .returning();
    }

    return Response.json({
      success: true,
      message: "Tasks saved successfully",
    });
  } catch (error) {
    console.log("An error occurred while saving tasks ", error);
    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
