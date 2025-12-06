#!/usr/bin/env npx tsx

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import { ConvexHttpClient } from "convex/browser";
import * as readline from "readline";
import { api } from "../convex/_generated/api";

// Initialize clients
const convex = new ConvexHttpClient(
  process.env.VITE_CONVEX_URL || "https://steady-bloodhound-673.convex.cloud"
);
const anthropic = new Anthropic();

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  dim: "\x1b[2m",
};

// System prompt for the AI agent
const SYSTEM_PROMPT = `You are a helpful hiring assistant for Cepat-Hire. You help with:
- Searching and viewing job listings
- Finding and screening candidates
- Managing applications
- Answering questions about the hiring process

You have access to the following data from the system (provided in context).

When the user asks about jobs, candidates, or applications, use the context provided to give accurate answers.
Be concise but helpful. Format responses for terminal output (use simple formatting, no markdown).

If asked to perform an action like "screen candidate X for job Y", explain what you would look for based on the job requirements and candidate skills.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Conversation history
const messages: Message[] = [];

async function getContext(): Promise<string> {
  try {
    const [jobs, candidates, applications] = await Promise.all([
      convex.query(api.jobs.list, {}),
      convex.query(api.candidates.list, {}),
      convex.query(api.applications.list, {}),
    ]);

    return `
CURRENT DATA:

JOBS (${jobs.length}):
${jobs.map((j) => `- ${j.title} at ${j.company} (${j.status}) - Skills: ${j.requirements.join(", ")}`).join("\n")}

CANDIDATES (${candidates.length}):
${candidates.map((c) => `- ${c.name} (${c.email}) - Status: ${c.status} - Skills: ${c.skills.join(", ")}`).join("\n")}

APPLICATIONS (${applications.length}):
${applications.map((a) => `- Application ${a._id}: Status ${a.status}${a.notes ? ` - Notes: ${a.notes}` : ""}`).join("\n")}
`;
  } catch (error) {
    return "\n[No data available - run the seed function first: npx convex run seed:seedData]\n";
  }
}

async function chat(userMessage: string): Promise<void> {
  messages.push({ role: "user", content: userMessage });

  // Get current context from Convex
  const context = await getContext();

  process.stdout.write(`\n${colors.green}Assistant:${colors.reset} `);

  try {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT + "\n\n" + context,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    let assistantResponse = "";

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        const text = event.delta.text;
        process.stdout.write(text);
        assistantResponse += text;
      }
    }

    messages.push({ role: "assistant", content: assistantResponse });
    console.log("\n");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n${colors.yellow}Error: ${error.message}${colors.reset}\n`);
      if (error.message.includes("API key")) {
        console.log(
          `${colors.dim}Set ANTHROPIC_API_KEY in your environment${colors.reset}\n`
        );
      }
    }
  }
}

async function main() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════╗
║       Cepat-Hire AI Assistant          ║
║     Type 'exit' or 'quit' to leave     ║
║     Type 'clear' to reset chat         ║
╚════════════════════════════════════════╝${colors.reset}
`);

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(
      `${colors.yellow}Warning: ANTHROPIC_API_KEY not set. Add it to .env.local${colors.reset}\n`
    );
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question(`${colors.cyan}You:${colors.reset} `, async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      if (trimmed === "exit" || trimmed === "quit") {
        console.log(`\n${colors.dim}Goodbye!${colors.reset}\n`);
        rl.close();
        process.exit(0);
      }

      if (trimmed === "clear") {
        messages.length = 0;
        console.log(`\n${colors.dim}Chat history cleared.${colors.reset}\n`);
        prompt();
        return;
      }

      await chat(trimmed);
      prompt();
    });
  };

  prompt();
}

main();
