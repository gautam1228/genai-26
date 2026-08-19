import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "test-app" });

const helloWorld = inngest.createFunction(
    { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

export const functions = [helloWorld];
