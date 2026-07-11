import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    OPENAI_API_KEY: z
        .string()
        .min(1, "OPENAI_API_KEY is required")
        .describe("The API key for OpenAI"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const parsedEnv = envSchema.safeParse(env);
    if (!parsedEnv.success) {
        console.error(
            "Error in loading environment variables:",
            parsedEnv.error.issues.map(
                (issue) => `${issue.path.join(".")}: ${issue.message}`,
            ),
        );
        process.exit(1);
    }
    return parsedEnv.data;
}

export const env = createEnv(process.env);
