import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function indexDocument(documentPath) {
    try {
        // #region Loading the pdf and chunking it
        const loader = new PDFLoader(documentPath);
        const document = await loader.load(); // Chunks the document page by page
        // #endregion

        // #region Creating Embeddings of the PDF
        const embedder = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
            apiKey: process.env.OPENAI_API_KEY,
        });
        // #endregion

        // #region Storing the embeddings in the qdrant vector store
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embedder,
            {
                url: "http://localhost:6333",
                collectionName: "rag-docs",
            },
        );
        await vectorStore.addDocuments(document);
        // #endregion
        console.log("All documents indexed successfully ...");
    } catch (error) {
        console.log("Error while indexing documents:", error);
    }
}

indexDocument("nodejs.pdf");
