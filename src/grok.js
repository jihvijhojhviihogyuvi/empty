import axios from "axios";

export class GrokClient {
  constructor(key) {
    this.key = key;
  }

  async chat(messages) {
    const res = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-2",
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${this.key}`
        }
      }
    );

    return res.data;
  }
}