import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: "Hey there, my name is Gautam.",
    });

    console.log(response.output_text);
}

main();
