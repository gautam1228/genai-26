import { get_encoding } from "tiktoken";

// Encode tokens
const encoderGpt2 = get_encoding("gpt2");

const text = "Hello, world!";

const tokens = encoderGpt2.encode(text);

console.log(tokens);

// Decode tokens
const decoderGpt2 = new TextDecoder();

const decodedTokens = decoderGpt2.decode(encoderGpt2.decode(tokens));

console.log(decodedTokens);

encoderGpt2.free(); // Freeing the tokenizer after use
