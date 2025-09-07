/*
  ContentOptimizer: synthesizes multiple scraped sources into brand-voiced, enriched content.
  - Uses OpenAI when USE_OPENAI=1 and OPENAI_API_KEY is set
  - Fallback: heuristic merge + commentary
*/

type RawSource = {
  title: string;
  summary?: string;
  content?: string;
  source?: string;
  url?: string;
  publishedAt?: string | Date;
  stats?: Record<string, any>;
};

export type Synthesized = {
  title: string;
  summary: string;
  content: string;
  embeds?: { type: 'youtube' | 'instagram' | 'link'; url: string }[];
};

const JAMAICAN_VOICE_GUIDE = `
Write in YaadFeed's voice: informative, concise, with subtle Jamaican flavor.
Use light Jamaican expressions sparingly (e.g., "nuh", "likkle", "yaad") without overdoing it.
Always add 2–3 sentences of context/backstory relevant to Jamaica or the Caribbean.
Blend overlapping facts, avoid duplication, and cite sources inline with parentheses (Source: <domain>).`;

function extractDomain(u?: string) {
  try { return u ? new URL(u).hostname.replace('www.', '') : ''; } catch { return ''; }
}

function buildFallbackSummary(sources: RawSource[]) {
  const title = sources[0]?.title || 'Update';
  const points = sources
    .map(s => `- ${s.summary || (s.content || '').slice(0, 140)}${s.url ? ` (Source: ${extractDomain(s.url)})` : ''}`)
    .slice(0, 4)
    .join('\n');
  return { title, summary: (sources[0]?.summary || title).slice(0, 180), points };
}

function addBrandContext(text: string) {
  const context = `\n\nContext: Jamaica continues to shape regional culture and music. Compared to last year, engagement around similar stories grew notably across diaspora communities.`;
  return text + context;
}

export async function synthesizeArticle(sources: RawSource[]): Promise<Synthesized> {
  const hasOpenAI = typeof window === 'undefined' && process.env.USE_OPENAI === '1' && !!process.env.OPENAI_API_KEY;

  if (hasOpenAI) {
    try {
      const mod: any = await (new Function('m', 'return import(m)'))('openai');
      const OpenAI = mod.default || mod;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are an editor at YaadFeed. ${JAMAICAN_VOICE_GUIDE}
Blend these sources into one original article with a crisp summary (1–2 sentences) and 4–7 short paragraphs. If there are stats/dates, transform them into an insight.
Return JSON with keys: title, summary, content, embeds (optional array of objects with type and url). Sources:\n${JSON.stringify(sources, null, 2)}`;
      const resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You produce JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });
      const raw = resp.choices?.[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);
      return {
        title: parsed.title || sources[0]?.title || 'Update',
        summary: parsed.summary || sources[0]?.summary || '',
        content: parsed.content ? String(parsed.content) : addBrandContext((sources[0]?.content || '')).slice(0, 6000),
        embeds: Array.isArray(parsed.embeds) ? parsed.embeds : [],
      };
    } catch (e) {
      // fall through to heuristic
    }
  }

  // Fallback heuristic
  const fb = buildFallbackSummary(sources);
  const merged = sources.map(s => `\n\n${s.title}\n${(s.content || s.summary || '').slice(0, 800)}${s.url ? `\n(Source: ${extractDomain(s.url)})` : ''}`).join('');
  return {
    title: fb.title,
    summary: fb.summary,
    content: addBrandContext(`${fb.summary}\n${fb.points}\n${merged}`).slice(0, 9000),
    embeds: [],
  };
}


