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
  toneOfVoice?: string;
  intendedAudience?: string;
  contentDepth?: string;
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
- Preferred Tone: ${input.toneOfVoice || "Expert/Educational"}
- Intended Audience Persona: ${input.intendedAudience || "General Local Customers"}
- Depth Setting: ${input.contentDepth || "Standard"}

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
PREMIUM STRATEGY PARAMETERS:
- Tone of Voice: ${input.toneOfVoice || "Expert/Educational"}
- Target Audience Focus: ${input.intendedAudience || "General Local Customers"}
- Word Count Objective: Approximately ${input.contentDepth === "Comprehensive" ? "1800" : input.contentDepth === "Short" ? "800" : "1200"} words.

BLOG PLAN: ${JSON.stringify(blogPlan)}
INTERNAL LINKS YOU MUST INCLUDE: ${JSON.stringify(outboundLinks)}

STRUCTURE REQUIREMENTS:
- Use Markdown formatting! Use single # for H1, ## for H2, ### for H3.
- H1: ${blogPlan.target_keyword}, stated as a clear question or value headline. Only ONE H1!
- 3–6 H2 sections, each targeting a secondary keyword or PAA question.
- At least 1-2 H3 sub-sections per H2.
- Conclude with an H2 CTA section pointing to clinic contact.

CONTENT REQUIREMENTS:
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

const EmailSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING },
    htmlContent: { type: Type.STRING, description: "Beautiful, styled HTML email body containing professional modern template design with CSS, tables, list items, and spacing." },
    textContent: { type: Type.STRING }
  }
};

export async function generateSubscriptionEmail(email: string, businessInput: any | null) {
  let prompt = `Write an extremely professional, premium marketing welcome email from the expert team at "SEO Cluster Mapping Suite" to "${email}".`;
  if (businessInput && businessInput.businessName) {
    prompt += ` Custom-tailor the content to their specific local business:
    - Name: ${businessInput.businessName}
    - Type: ${businessInput.businessType}
    - City/Area: ${businessInput.area}, ${businessInput.city}
    - Primary Keyword Focus: ${businessInput.primaryKeyword}
    - Core Services: ${businessInput.services}
    
    Give them a personalized, strategic regional plan explaining why high-density topical mapping of ${businessInput.primaryKeyword} will capture regional visibility in ${businessInput.city}. Use professional headings (H2, H3), lists, and neat aesthetic formatting in the email. Raise enthusiasm for their newly calculated organic opportunity.`;
  } else {
    prompt += ` Provide a generic premium welcome containing 3 elite, immediately actionable tactical SEO tips regarding regional Google SERPs, E-E-A-T markup, and content clusters.`;
  }
  
  prompt += ` Ensure the HTML content is beautiful, formatted with clean modern CSS styles suitable for responsive viewing. No markdown symbols inside the final HTML string.`;

  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: EmailSchema,
      temperature: 0.7,
    }
  });

  let text = response.text;
  if (!text) throw new Error("No response returned from Gemini.");
  return JSON.parse(text);
}

export async function generateCheckoutEmail(email: string, planName: string, price: number, billingPeriod: string, businessName: string) {
  const prompt = `
  Write a premium receipt, invoice, and workspace onboarding welcome email from "SEO Cluster Mapping Suite" to "${email}".
  
  DETAILS:
  - Plan Subscribed: ${planName}
  - Price: $${price}/month
  - Billing Term: ${billingPeriod === "yearly" ? "Billed Horizontally/Annually" : "Billed Monthly"}
  - Client Entity Name: ${businessName}
  - Status: COMPLIANT ACTIVE / SECURE CLUSTER ENGAGED
  
  Congratulations on launching their high-ingress workspace. Provide 3 highly tactical guidelines on launching their newly calculated cluster node links. Render a beautiful, professional styled border layout inside the HTML, complete with an invoice metadata box showing fake transaction reference ID SCS-491-032.
  `;

  const response = await getAI().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: EmailSchema,
      temperature: 0.7,
    }
  });

  let text = response.text;
  if (!text) throw new Error("No response returned from Gemini.");
  return JSON.parse(text);
}

