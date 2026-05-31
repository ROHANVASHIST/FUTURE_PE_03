import { GoogleGenAI, Type, Schema } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const SEO_SYSTEM_PROMPT = `
You are a senior SEO content strategist and long-form writer with 8 years of experience
creating content clusters for local businesses, clinics, agencies, and SaaS companies.

Your content consistently ranks on page 1 of Google because it:
- Precisely matches the search intent of the target keyword
- Follows a strict H1 → H2 → H3 heading hierarchy
- Incorporates geo-modified local SEO keywords naturally
- Demonstrates E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
- Contains specific, helpful information — not padded, generic filler

YOUR WRITING RULES — follow without exception:
- H1: appears ONCE, contains the primary keyword, answers the searcher's question
- H2s: each targets a secondary keyword or "People Also Ask" question
- H3s: specific sub-points under H2s; at least 2 H3s per major H2
- Paragraphs: max 3 sentences; no walls of text
- Local keywords: include city/area name naturally every 300–400 words
- No keyword stuffing: keyword density target is 1–1.5%
- Never write fluff openers like "In today's world..." or "Are you looking for..."
- Every blog must end with a business-focused CTA section
- Use active voice throughout
`;

export interface BusinessInput {
  businessName: string;
  businessType: string;
  city: string;
  area: string;
  services: string;
  primaryKeyword: string;
}

const ClusterPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    keywordMap: {
      type: Type.OBJECT,
      properties: {
        primary: {
          type: Type.OBJECT,
          properties: { keyword: { type: Type.STRING }, intent: { type: Type.STRING }, format: { type: Type.STRING }, difficulty: { type: Type.STRING } },
        },
        secondary: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, intent: { type: Type.STRING }, format: { type: Type.STRING }, difficulty: { type: Type.STRING } } }
        },
        long_tail: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, intent: { type: Type.STRING }, format: { type: Type.STRING }, local_modifier: { type: Type.BOOLEAN } } }
        },
        faq_keywords: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, intent: { type: Type.STRING }, format: { type: Type.STRING } } }
        }
      }
    },
    cluster: {
      type: Type.OBJECT,
      properties: {
        pillar: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            target_keyword: { type: Type.STRING },
            intent: { type: Type.STRING },
            word_count_target: { type: Type.INTEGER }
          }
        },
        supporting: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              target_keyword: { type: Type.STRING },
              intent: { type: Type.STRING },
              blog_type: { type: Type.STRING },
              word_count_target: { type: Type.INTEGER }
            }
          }
        }
      }
    },
    internal_link_map: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from_blog_title: { type: Type.STRING },
          to_blog_title: { type: Type.STRING },
          anchor_text: { type: Type.STRING }
        }
      }
    }
  }
};

const BlogSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        meta_description: { type: Type.STRING },
        target_keyword: { type: Type.STRING },
      }
    },
    markdownContent: { type: Type.STRING, description: "The full markdown content of the blog including # H1, ## H2, ### H3, paragraphs, and lists." }
  }
};

export async function generatePlan(input: BusinessInput) {
  const prompt = `
Generate a complete SEO content cluster plan for this local business.
BUSINESS:
- Name: ${input.businessName}
- Type: ${input.businessType}
- City: ${input.city}
- Area: ${input.area}
- Services: ${input.services}
- Primary Keyword: ${input.primaryKeyword}

Requirement: Return a JSON object with:
1. keywordMap (primary, secondary, long_tail, faq_keywords)
2. cluster (pillar blog details, and exactly 3 supporting blogs for brevity)
3. internal_link_map (showing how these 4 blogs link to each other)
`;
  
  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SEO_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: ClusterPlanSchema,
      temperature: 0.7,
    }
  });

  let text = response.text;
  if (!text) throw new Error("No response returned from Gemini.");
  return JSON.parse(text);
}

export async function generateBlog(input: BusinessInput, blogPlan: any, isPillar: boolean, linkMap: any[]) {
    // Determine links relevant to this blog
    const outboundLinks = linkMap.filter(l => l.from_blog_title === blogPlan.title);

    const prompt = `
Write a complete long-form SEO ${isPillar ? 'pillar' : 'supporting'} blog for this local business.

BUSINESS: ${input.businessName}, ${input.area}, ${input.city}
BLOG PLAN: ${JSON.stringify(blogPlan)}
INTERNAL LINKS YOU MUST INCLUDE: ${JSON.stringify(outboundLinks)}

STRUCTURE REQUIREMENTS:
- Use Markdown formatting! Use single # for H1, ## for H2, ### for H3.
- H1: ${blogPlan.target_keyword}, stated as a clear question or value headline. Only ONE H1!
- 3–6 H2 sections, each targeting a secondary keyword or PAA question.
- At least 1-2 H3 sub-sections per H2.
- Conclude with an H2 CTA section pointing to clinic contact.

CONTENT REQUIREMENTS:
- Target word count: roughly ${blogPlan.word_count_target}.
- Use local keywords (e.g. ${input.city} + service) naturally every few paragraphs.
- Inject the outbound links into the prose exactly matching the requested anchor text to link to the other blogs. Example format: [anchor text](/blog/slug).
- E-E-A-T signals: include specific details, procedure steps, realism.

Return a JSON object containing meta data and a 'markdownContent' string with the FULL textual body of the blog in markdown format.
`;

  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SEO_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: BlogSchema,
      temperature: 0.7,
    }
  });

  let text = response.text;
  if (!text) throw new Error("No response returned from Gemini.");
  return JSON.parse(text);
}
