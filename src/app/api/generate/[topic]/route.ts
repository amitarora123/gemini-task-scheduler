import model from "@/lib/gemini";

const humanDelay = async (char: string) => {
  let base = 1;

  if (/[.,!?]/.test(char)) {
    base = 15;
  } else if (char === " ") {
    base = 5;
  }

  const jitter = Math.random() * 5;
  await new Promise((res) => setTimeout(res, base + jitter));
};
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ topic: string }> }
) => {
  const { topic } = await params;
  const decodedTopic = decodeURIComponent(topic);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const prompt = `Generate a list of 5 concise, structured, and actionable tasks to learn about ${decodedTopic}. Avoid generic suggestions. Ensure each task is specific and builds toward practical understanding or implementation. Return the tasks as a single string separated by || without any numbering, bullet points, or newlines.`;

        const result = await model.generateContentStream(prompt);

        const fullText = (await result.response).text();
        for (const chunk of fullText) {
          const message = `data: ${chunk}\n\n`;
          controller.enqueue(encoder.encode(message));
          await humanDelay(chunk);
        }

        controller.enqueue(encoder.encode("event: end\ndata: done\n\n"));

        controller.close();
      } catch (error) {
        console.error("Error in streaming: ", error);
        controller.enqueue(encoder.encode(`data: Error occurred.\n\n`));
        controller.enqueue(encoder.encode("event: end\ndata: error\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
