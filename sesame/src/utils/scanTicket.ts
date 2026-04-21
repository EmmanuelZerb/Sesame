import type { TicketType } from '@/types';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;

interface ScannedData {
  type?: TicketType | null;
  title?: string | null;
  subtitle?: string | null;
  date?: string | null;
  time?: string | null;
  venue?: string | null;
  seat?: string | null;
  gate?: string | null;
  reference?: string | null;
}

export async function scanTicketWithAI(
  base64Image: string,
  mimeType: string,
): Promise<ScannedData> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('EXPO_PUBLIC_ANTHROPIC_KEY is not set in .env');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `Analyze this ticket image and extract ALL visible information. Return ONLY valid JSON, no markdown, no extra text:
{"type":"flight|concert|train|sport|theater|other","title":"","subtitle":"","date":"YYYY-MM-DD","time":"HH:MM","venue":"","seat":"","gate":"","reference":""}
Use null for any field not found.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const text: string = data.content[0].text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  return JSON.parse(text) as ScannedData;
}
