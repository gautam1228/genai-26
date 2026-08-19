import express from "express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Middlewares
app.use(express.json());
app.use("/api/inngest", serve({ client: inngest, functions }));

// Sample route to test sending an event to the inngest handler
app.get("/api/hello", async function (req, res, next) {
    await inngest
        .send({
            name: "test/hello.world",
            data: {
                email: "testUser@example.com",
            },
        })
        .catch((err) => next(err));
    res.json({ message: "Event sent!" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
