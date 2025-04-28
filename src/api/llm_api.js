import OpenAI from "openai"
import 'openai/shims/node';


export async function POST(req, systemPrompt, apiKey) {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      dangerouslyAllowBrowser: true, // Enable this option for browser-like environments
    })
    const data = req

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free",
      response_format: { type: "json_object" },
    })

    console.log("completion", completion)

    return completion.choices[0].message.content
  } catch (error) {
    console.error("Error in LLM API:", error)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}
