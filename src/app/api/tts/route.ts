import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/lib/mongodb';

export const maxDuration = 60; // Allow more time for ElevenLabs processing

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // 1. Check database for cached audio
    const article = await NewsService.getNewsBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.audioBase64) {
      // Stream cached base64 audio directly to client
      const audioBuffer = Buffer.from(article.audioBase64, 'base64');
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // 2. If no cached audio, check API key
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obbfIdG4C3Kk2w'; // Default deep male voice

    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '' || ELEVENLABS_API_KEY.includes('your_')) {
      // Mock mode for local dev without key
      console.log('No ElevenLabs API key found, playing silent mock audio');
      // A tiny 1-second empty MP3 buffer
      const mockMp3 = Buffer.from('SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/+0DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAEAAAAKAAAAKABcXEJJSkpOT1BRVllZWl1dYWFiYmdmaWlrbmxub3JwcXN3d3h6e3x+f4CAgoKDhomJi42Pj5GSk5WWl5iZmpueoKGio6WnqKmrra+wsbO1tre4uru9v8HCw8TGx8jKy8zO0NLT1NXW2Nna293f4OHi4+Xn6Onq7O3v8PHy8/T29/j5+vv8/f7/AAAAAExhdmM2MS4zAAAAAAAAAAAAAAAAJAz/AAACAALXAAAKADgAAAAAAAA=', 'base64');
      return new NextResponse(mockMp3, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': mockMp3.length.toString(),
        },
      });
    }

    // 3. Extract plain text from article
    const textToRead = `${article.title}. ... ${article.content.replace(/<[^>]+>/g, ' ')}`;
    // Trim text to avoid exceeding limits (e.g. 2500 chars)
    const safeText = textToRead.substring(0, 3000);

    // 4. Call ElevenLabs API
    console.log(`Generating ElevenLabs audio for ${slug}...`);
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: safeText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 5. Cache to Database
    const base64Audio = buffer.toString('base64');
    await NewsService.saveAudio(slug, base64Audio);
    console.log(`Audio generated and cached in DB for ${slug}. Size: ${base64Audio.length} bytes`);

    // 6. Return audio to client
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache on client side for 1 year
      },
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
