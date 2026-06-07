import express from "express";
import dotenv from "dotenv";
import { GrokClient } from "./src/grok.js";
import { runCommand } from "./src/tools.js";
import { isBlocked } from "./src/safety.js";

dotenv.config();

const app = express();
app.use(express.json());

const client = new GrokClient(process.env.GROK_API_KEY);

app.post("/agent", async (req, res) => {
  const { prompt } = req.body;

  const response = await client.chat([
    { role: "user", content: prompt }
  ]);

  const msg = response.choices?.[0]?.message;

  if (!msg?.tool_calls) {
    return res.json({ output: msg?.content });
  }

  const results = [];

  for (const call of msg.tool_calls) {
    const { command } = JSON.parse(call.function.arguments || "{}");

    if (isBlocked(command)) {
      results.push({ error: "blocked" });
      continue;
    }

    results.push(await runCommand(command));
  }

  res.json({ results });
});

app.listen(8787, () => console.log("running on 8787"));