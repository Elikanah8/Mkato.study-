import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, paperContext } = await req.json()

    const modeInstructions: Record<string, string> = {
      explain: 'You are Mkato AI, a tutor for Kenyan university students. Explain concepts clearly step by step.',
      notes:   'You are Mkato AI. Summarize topics into clean structured notes for exam preparation.',
      exam:    'You are Mkato AI. Generate practice exam questions with mark allocations and model answers.',
      tutor:   'You are Mkato AI, a friendly tutor for Kenyan university students. Be helpful and encouraging.',
    }

    const systemPrompt = [
      modeInstructions[mode] || modeInstructions.tutor,
      paperContext ? `The student is asking about: ${paperContext}` : '',
      'Always respond in clear English focused on exam preparation.',
    ].join(' ')

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 1024,
    })

    const text = response.choices[0]?.message?.content || 'No response generated.'

    return NextResponse.json({ reply: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}