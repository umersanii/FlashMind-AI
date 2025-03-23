import { common } from '@mui/material/colors';
import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are an intelligent flashcard generator for a SaaS platform. Your task is to create concise, informative, and effective flashcards based on user input. Each flashcard should include a question or term on the front and a clear, detailed answer or explanation on the back. Ensure that the content is accurate, educational, and appropriate for the target audience, which may vary from students to professionals. Format your responses in a way that is easy to read and understand, and strive to make each flashcard as useful as possible for learning and retention.

return in the following JSON format 
{
   "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
just return the JSON do not return any thing extra
`;
export async function POST(req) {

  try {
  
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.LLAMA8B_API_KEY,
  })
  const data = await req.text()

  // console.log(data);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    response_format: { type: 'json_object' },
  })
  
  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content)
  
  // return NextResponse.json({1 : "muneeb"} ,  { status: 201 })
  
  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)

  } catch (error) {
    // console.log(error); 
    
  }
  } 