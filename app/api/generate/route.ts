import { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { isAuthenticated } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  // Verify the user is authenticated
  const authed = await isAuthenticated()
  if (!authed) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()

  function sendEvent(data: Record<string, unknown>) {
    return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { url, ratio, style = 'modern' } = await request.json()

        if (!url || !ratio) {
          controller.enqueue(sendEvent({ type: 'error', error: 'Missing url or ratio' }))
          controller.close()
          return
        }

        if (!process.env.GEMINI_API_KEY) {
          controller.enqueue(sendEvent({ type: 'error', error: 'GEMINI_API_KEY not configured' }))
          controller.close()
          return
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        // Step 1: Analyze YouTube video
        controller.enqueue(sendEvent({ type: 'progress', step: 1, message: 'Analyzing video content...' }))

        const analysisResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an expert content analyst and visual designer. Watch this entire YouTube video carefully and extract a summary optimized for a VISUAL infographic (mostly graphics, minimal text).

Provide:
1. "title": A punchy, bold headline (4-8 words). Think magazine cover, not essay title.
2. "keyPoints": Array of exactly 4 key takeaways. Each has:
   - "icon": A concrete visual icon/illustration description (e.g. "megaphone with sound waves", "rocket launching from phone screen", "handshake between two people"). Be specific and visual — this will be drawn as a LARGE illustration.
   - "label": Maximum 5 words summarizing the point. NOT a sentence.
3. "stats": Array of 2-3 statistics or numbers from the video. Each has:
   - "value": The number (e.g. "73%", "10x", "$2M")
   - "label": Short context (max 6 words)
4. "takeaway": One powerful concluding sentence (max 12 words). The single most important message.
5. "visualMetaphors": Array of 2-3 visual concepts that represent the video's themes (e.g. "viral spreading network", "money tree growing", "bullseye target with arrow"). These will be used as background illustrations.
6. "colorPalette": Array of 4-5 hex colors that match the topic's mood and energy.

CRITICAL: Keep ALL text extremely short. This is for a GRAPHIC DESIGN piece, not a document. Labels are max 5 words. The illustrations and icons ARE the content.

Format your response as JSON only, nothing else:
{
  "title": "...",
  "keyPoints": [
    { "icon": "...", "label": "..." }
  ],
  "stats": [
    { "value": "...", "label": "..." }
  ],
  "takeaway": "...",
  "visualMetaphors": ["...", "..."],
  "colorPalette": ["#hex", "#hex"]
}`,
                },
                {
                  fileData: {
                    fileUri: url,
                    mimeType: 'video/*',
                  },
                },
              ],
            },
          ],
        })

        const analysisText = analysisResponse.text || ''

        interface Analysis {
          title: string
          keyPoints: { icon: string; label: string }[]
          stats: { value: string; label: string }[]
          takeaway: string
          visualMetaphors: string[]
          colorPalette: string[]
        }

        let analysis: Analysis
        try {
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
          analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText)
        } catch {
          analysis = {
            title: 'Video Summary',
            keyPoints: [{ icon: 'lightbulb glowing', label: 'Key insight' }],
            stats: [],
            takeaway: 'Watch the full video for details.',
            visualMetaphors: ['abstract geometric shapes', 'connecting lines'],
            colorPalette: ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00CEC9'],
          }
        }

        // Step 2: Generate infographic image
        controller.enqueue(sendEvent({ type: 'progress', step: 2, message: 'Generating infographic...' }))

        const layoutGuidance: Record<string, string> = {
          '1:1': 'Square layout. Bold title across the top 20%. Central area: 2x2 grid of icon+label cards. Bottom strip: 2-3 stat bubbles side by side. Takeaway quote at the very bottom.',
          '9:16': 'Tall vertical layout for mobile. Title banner at top. Icons with short labels stacked vertically down the center, each with a unique illustrated icon. Stats in colored pill shapes near the bottom. Takeaway at the base.',
          '16:9': 'Wide landscape layout. Title on the left 30%. Center: horizontal flow of illustrated icons with labels underneath. Right side: stats in large bold numbers stacked. Takeaway bar along the bottom edge.',
        }

        const pointsList = analysis.keyPoints
          .slice(0, 4)
          .map((p) => `• Icon: ${p.icon} — Label: "${p.label}"`)
          .join('\n')

        const statsList = analysis.stats
          .slice(0, 3)
          .map((s) => `"${s.value}" (${s.label})`)
          .join(', ')

        const metaphors = analysis.visualMetaphors?.length > 0
          ? analysis.visualMetaphors.join(', ')
          : 'abstract geometric shapes, connecting lines, glowing accents'

        const colors = analysis.colorPalette?.length > 0
          ? analysis.colorPalette.join(', ')
          : '#6C5CE7, #A29BFE, #FD79A8, #FDCB6E, #00CEC9'

        const styleGuides: Record<string, { intro: string; rules: string }> = {
          modern: {
            intro: 'Design a bold, modern infographic poster. VISUALS FIRST — use large vector illustrations, icons, and graphics. Text should be minimal and punchy.',
            rules: `- This is a GRAPHIC DESIGN piece, not a document. Think magazine ad or poster, not blog post.
- 70% of the space should be illustrations, icons, and graphics. Only 30% text.
- Each key point gets a LARGE, detailed illustration/icon (not a tiny clip-art). The illustration IS the content.
- Statistics should be HUGE bold numbers (the biggest text after the title). The number itself is the visual.
- NO long sentences. NO paragraphs. NO bullet point lists of text. Maximum 5 words per label.
- Use bold color blocks, gradients, and shapes to create visual sections.
- The overall feel should be: premium, editorial, eye-catching — like a high-end magazine infographic.
- Background should use subtle gradients or color blocks, NOT plain white.
- Add visual texture: subtle patterns, grain, shadows, depth.
- NO watermarks, NO attribution text.`,
          },
          cartoon: {
            intro: 'Design a fun, cartoon-style infographic poster. Use hand-drawn cartoon illustrations with thick outlines, exaggerated proportions, and a comic-book feel. Bright, saturated, playful colors.',
            rules: `- CARTOON / COMIC-BOOK aesthetic throughout. Every element looks hand-drawn and playful.
- Thick black outlines on all illustrations. Exaggerated, fun proportions.
- Use speech bubbles or comic panels for statistics. Stars, exclamation marks, and motion lines for emphasis.
- Bright, saturated color palette — think comic book or animated show.
- Each key point icon should be a fun, exaggerated cartoon character or object.
- Typography should be bold, rounded, and comic-style (not corporate).
- Background: colorful with halftone dots, comic-book patterns, or starburst shapes.
- Overall vibe: energetic, fun, approachable — like a Cartoon Network infographic.
- NO watermarks, NO attribution text.`,
          },
          minimal: {
            intro: 'Design a clean, minimalist infographic poster. Emphasis on whitespace, restrained typography, and simple geometric forms. Elegant and understated.',
            rules: `- MINIMALIST aesthetic. Less is more. Generous whitespace everywhere.
- Muted, pastel color palette — soft grays, pale blues, dusty pinks. Maximum 3 colors.
- Thin, elegant sans-serif typography. Light font weights for body, medium for headings.
- Icons should be simple, single-stroke geometric line icons — not detailed illustrations.
- Statistics rendered in clean, thin typography with ample spacing.
- NO gradients, NO shadows, NO textures. Pure flat simplicity.
- Background: clean white or very light neutral. Subtle thin lines to divide sections.
- Overall vibe: premium, calm, sophisticated — like a high-end design studio portfolio piece.
- NO watermarks, NO attribution text.`,
          },
          lineart: {
            intro: 'Design an infographic poster using ONLY black ink lines on a pure white background. Pen-and-ink illustration style. No color fills whatsoever.',
            rules: `- BLACK AND WHITE ONLY. No color fills at all. Pure pen-and-ink style.
- All illustrations drawn with black ink lines. Use crosshatching and stippling for shading/depth.
- Hand-sketched, organic line quality — not perfectly geometric. Think editorial illustration.
- Typography in black only — mix of serif and hand-lettered styles.
- Statistics rendered as large hand-drawn numbers with decorative flourishes.
- Background: pure white paper. No color, no gradients, no gray fills.
- Section dividers: hand-drawn lines, borders, or decorative rules.
- Overall vibe: artistic, editorial, intellectual — like a New Yorker magazine illustration.
- NO watermarks, NO attribution text.`,
          },
          isometric: {
            intro: 'Design an infographic poster using isometric 3D illustrations. All objects shown from a 30-degree isometric perspective with no vanishing points. Colorful, structured, and technically polished.',
            rules: `- ISOMETRIC 3D style throughout. All objects at consistent 30-degree angle, no perspective vanishing points.
- Each key point illustrated as a detailed isometric 3D scene or object.
- Use depth and layered isometric planes to create visual hierarchy.
- Bold, vibrant but structured color palette. Consistent light source direction.
- Statistics can float on isometric platforms or cubes.
- Clean, geometric sans-serif typography that complements the technical aesthetic.
- Background: subtle isometric grid pattern or soft gradient.
- Overall vibe: modern tech, polished, dimensional — like a startup landing page hero illustration.
- NO watermarks, NO attribution text.`,
          },
          flat: {
            intro: 'Design an infographic poster in flat design style. Solid geometric shapes, bold colors, no shadows or gradients. Clean, modern, and grid-aligned.',
            rules: `- FLAT DESIGN aesthetic. Absolutely no shadows, no gradients, no 3D effects.
- Solid color fills only. Bold, contrasting color blocks to define sections.
- Simple, geometric iconography — circles, rectangles, triangles. Material design influence.
- Each key point gets a bold, simple flat icon in a colored circle or card.
- Statistics in large, bold sans-serif type on contrasting color blocks.
- Strong grid alignment. Clean edges. Precise spacing.
- Background: solid color or simple two-tone split. No textures or patterns.
- Overall vibe: Google Material Design meets Swiss poster design — clean, bold, structured.
- NO watermarks, NO attribution text.`,
          },
        }

        const activeStyle = styleGuides[style] || styleGuides.modern

        const imagePrompt = `${activeStyle.intro}

LAYOUT: ${layoutGuidance[ratio] || layoutGuidance['1:1']}

TITLE (large, bold, eye-catching text at the top):
"${analysis.title}"

KEY POINTS (each one is an ILLUSTRATED ICON with a SHORT label beneath it — NOT paragraphs of text):
${pointsList}

Use these visual concepts to create rich, detailed illustrations for each point: ${metaphors}

STATISTICS (render as BIG BOLD NUMBERS with tiny labels beneath):
${statsList}

BOTTOM TAKEAWAY (one powerful line):
"${analysis.takeaway}"

COLOR PALETTE: ${colors}

CRITICAL DESIGN RULES:
${activeStyle.rules}`

        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: imagePrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        })

        // Extract image from response parts
        let base64Image: string | null = null
        const parts = imageResponse.candidates?.[0]?.content?.parts
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
              break
            }
          }
        }

        if (!base64Image) {
          controller.enqueue(sendEvent({ type: 'error', error: 'Image generation failed — no image in response' }))
          controller.close()
          return
        }

        // Step 3: Done
        controller.enqueue(sendEvent({
          type: 'result',
          title: analysis.title,
          image: base64Image,
          keyPoints: analysis.keyPoints.map((p) => p.label),
        }))
        controller.close()
      } catch (err) {
        console.error('Generation error:', err)
        const rawMessage = err instanceof Error ? err.message : 'Unknown error'

        // Map raw API errors to user-friendly messages
        let userMessage: string
        if (rawMessage.includes('token count exceeds') || rawMessage.includes('maximum number of tokens')) {
          userMessage = 'This video is too long to process. Please try a shorter video (under 45 minutes).'
        } else if (rawMessage.includes('Could not resolve') || rawMessage.includes('INVALID_ARGUMENT')) {
          userMessage = 'Could not access this video. Please check the URL and make sure the video is public.'
        } else if (rawMessage.includes('quota') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
          userMessage = 'Our servers are busy right now. Please try again in a few minutes.'
        } else if (rawMessage.includes('Image generation failed')) {
          userMessage = 'Failed to generate the infographic image. Please try again.'
        } else {
          userMessage = 'Something went wrong while generating your infographic. Please try again.'
        }

        controller.enqueue(sendEvent({ type: 'error', error: userMessage }))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
