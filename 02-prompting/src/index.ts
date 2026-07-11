import "dotenv/config";
import { OpenAI } from "openai";
import type { ResponseInput } from "openai/resources/responses/responses";

import { env } from "./env";
import { OPENAI_MODEL } from "./config";
import {
    COT_SYSTEM_PROMPT,
    type COT_RESPONSE_STEP,
} from "./prompts/03-cot-prompt";
import { getWeatherData } from "./tools";

const openaiClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

const MESSAGES_DB: ResponseInput = [
    { role: "system", content: COT_SYSTEM_PROMPT },
];

async function main(prompt = "") {
    MESSAGES_DB.push({ role: "user", content: prompt });

    let endLoop: boolean = false;
    while (true) {
        if (endLoop) break;
        // Streaming response
        const result = await openaiClient.responses.create({
            model: OPENAI_MODEL,
            stream: true,
            input: [...MESSAGES_DB],
        });

        for await (const chunk of result) {
            // if (chunk.type === "response.output_text.delta") {
            //     process.stdout.write(chunk.delta);
            // }
            if (chunk.type === "response.output_text.done") {
                const rawResult = chunk.text;
                const parsedResult: COT_RESPONSE_STEP = JSON.parse(rawResult);

                MESSAGES_DB.push({
                    role: "assistant",
                    content: rawResult,
                });

                if (parsedResult.step.toLowerCase() === "tool_request") {
                    process.stdout.write(
                        `🖭  (${parsedResult.step}): ${parsedResult.functionName}\n`,
                    );
                } else {
                    process.stdout.write(
                        `🖭  (${parsedResult.step}): ${parsedResult.text}\n`,
                    );
                }

                if (parsedResult.step.toLowerCase() === "output") {
                    endLoop = true;
                    break;
                }

                if (parsedResult.step.toLowerCase() === "tool_request") {
                    const { functionName, input } = parsedResult;

                    switch (functionName) {
                        case "getWeatherData":
                            {
                                const weatherToolResult = await getWeatherData(
                                    input ?? "",
                                );
                                process.stdout.write(
                                    `🛠️ (${functionName}:${input}) ${weatherToolResult}\n`,
                                );
                                MESSAGES_DB.push({
                                    role: "developer",
                                    content: JSON.stringify({
                                        step: "TOOL_OUTPUT",
                                        output: weatherToolResult,
                                    }),
                                });
                                continue;
                            }
                            break;
                    }
                }
            }
        }
    }
}

main("What is the weather in Delhi ?");
