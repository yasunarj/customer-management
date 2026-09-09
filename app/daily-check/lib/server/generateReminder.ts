import OpenAI from "openai";

type GenerateReminderInput = {
  date: string;
  totalTasks: number;
  missingTaskNames: string[];
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateReminder = async ({
  date,
  totalTasks,
  missingTaskNames
}: GenerateReminderInput): Promise<string | null> => {
  if (process.env.DAILY_CHECK_AI_ENABLED !== "true") {
    return null;
  }

  const prompt = `
  あなたは店舗業務のリマインド文を作成するアシスタントです。

  対象日: ${date}
  当日の対象タスク数: ${totalTasks}
  未チェックのタスク:
  ${missingTaskNames.map((name) => `- ${name}`).join("\n")}

  未チェックは、実作業の未実施とは限らず、チェックもれの可能性もあります。
  断定的・威圧的な表現は避けてください。

  100文字以内で、短く穏やかな補足文を１つ作成してください。
  `;

  try {
    const response = await client.responses.create({
      model: process.env.DAILY_CHECK_AI_MODEL ?? "gpt-5.6-luna",
      input: prompt
    })

    const text = response.output_text.trim();

    if (!text || text.length > 100) {
      return null;
    }

    return text;
  } catch (e) {
    console.error("generateReminder error:", e);
    return null;
  }
}

export default generateReminder;