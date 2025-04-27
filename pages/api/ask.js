import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemPrompt = `
You are Marine AI — an intelligent technical assistant for shipboard engineers, mechanics, and electro-technical officers.
You work onboard a cargo vessel and help troubleshoot real-time technical problems with ship equipment.
Use built-in PDF manuals when available. If missing, rely on marine engineering logic. Respond directly, no small talk.
`;

export default async function handler(req, res) {
  const { input } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
    });
    res.status(200).json({ answer: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ answer: "Error: " + err.message });
  }
}
