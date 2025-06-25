import { getCurrentUser } from "@/actions/auth.action";
import { db } from "@/db/drizzle";
import { Task, Topic } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (req: Request) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "UNAUTHORIZED ACCESS",
        },
        { status: 401 }
      );
    }

    const response = await db.query.Topic.findMany({
      where: (topics, { eq }) => eq(topics.userId, user.id),
      with: {
        tasks: true,
      },
    });

    return Response.json({
      success: true,
      message: "Tasks fetched successfully",
      data: response,
    }, {status: 200});
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "Something went wrong while fetching the tasks",
    }, {status: 500});
  }
};
