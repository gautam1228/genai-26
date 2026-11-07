import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";

const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function query(userQuery) {
    // Convert user query to embedding
    // Initialize the embedding model
    const embedder = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Perform similarity search on the vector store
    // Get an instance of the vectore store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embedder,
        {
            url: "http://localhost:6333",
            collectionName: "rag-docs",
        },
    );
    const retriever = vectorStore.asRetriever({ k: 5 });
    const results = await retriever.invoke(userQuery); // Automatically converts the user query to the appropriate vector embedding

    // Provide the retrieved chunk's content to the LLM as context
    const SYSTEM_PROMPT = `
        You are an expert in answering user queries based on the provided context about the document.
        Do not answer anything beyond what is provided.

        User Docs:
        ${results.map((e) => JSON.stringify({ pageContent: e.pageContent, pageNumber: e.metadata.loc.pageNumber })).join("\n\n")}
    `;

    // Get a response from the LLM and provide an appropriate response to the user
    const llmResponse = await openAIClient.responses.create({
        model: "gpt-4o-mini",
        input: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userQuery },
        ],
        stream: true,
    });

    for await (const chunk of llmResponse) {
        if (chunk.delta) {
            process.stdout.write(chunk.delta);
        }
        // process.stdout.write(chunk.delta);
    }
}

query("How can we import a module in Node.js?");
