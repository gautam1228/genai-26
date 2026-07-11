import "dotenv/config";
import { OpenAI } from "openai";
import { env } from "../env";
import { OPENAI_MODEL } from "../config";
import { FEW_SHOT_PROMPT } from "../prompts/02-few-shot-prompt";

const openaiClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

async function main() {
    // Streaming response
    const result = await openaiClient.responses.create({
        model: OPENAI_MODEL,
        stream: true,
        input: [
            {
                role: "user",
                content: FEW_SHOT_PROMPT,
            },
        ],
    });

    for await (const chunk of result) {
        if (chunk.type === "response.output_text.delta") {
            process.stdout.write(chunk.delta);
        }
    }
}

main();
