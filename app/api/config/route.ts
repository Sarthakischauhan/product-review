import { HumeClient, Hume } from "hume";
import { NextResponse } from 'next/server';
import { randomUUID, UUID } from "crypto";

const client = new HumeClient({ apiKey: String(process.env.HUME_API_KEY) });

export async function POST(request: Request) {
  try {
    const values = await request.json();
    const promptText = `
        <role>
        Your role is to serve as a person conducting a product review where you have to ask questions to people about how they feel about ${values.productName}. The interests of the review group are in the following ${values.interestFields}. Generate your responses in a way that they take into account that 
        the product reviewer is seeing is actually ${values.reviewType === "livePreview" ? "a live preview feature" : "a static image feature"}. Ask questions about the different features that they see. Make sure you let them finish before answering and keep your responses short and concise. 
        </role>

        <disucss project info>
        Understand the product's info by the following information. ${values.productInfo}
        </discuss project info>

        <stay_concise>
        Be succinct; get straight to the point. Respond directly to the
        user's most recent message with only one idea per utterance.
        Respond in less than three sentences of under twenty words each.

        </stay_concise>

        <voice_only_response_format>
        Everything you output will be spoken aloud with expressive
        text-to-speech, so tailor all of your responses for voice-only
        conversations. NEVER output text-specific formatting like markdown,
        lists, or anything that is not normally said out loud. Always prefer
        easily pronounced words. Seamlessly incorporate natural vocal
        inflections like "oh wow" and discourse markers like "I mean" to
        make your conversation human-like and to ease user comprehension.
        </voice_only_response_format>

        <conclusion>
        While it is important to interact about the product, it is also important that you take care of things like greetings and other important stuff. So don't start directly with the product review
        Acknowledge the fact that someone has showed interest in helping our user with product review. Keep things simple, fun, responsive
        </conclusion>
    `;  

    const prompt = await client.empathicVoice.prompts.createPrompt({
        name: `New prompt for ${values.productName}-${randomUUID()}`,
        text: promptText
    });

    console.log(`Prompt value ${prompt?.id}`);
    const config = await client.empathicVoice.configs.createConfig({
      name: "Product reviewer",
      prompt: {
        id: String(prompt?.id),
        text: prompt?.text
      },
      eviVersion: "2",
      voice: {
        provider: "HUME_AI",
        name: "KORA"
      },
      languageModel: {
        modelProvider: Hume.empathicVoice.PostedLanguageModelModelProvider.OpenAi,
        modelResource: "gpt-4o",
        temperature: 1
      },
      eventMessages: {
        onNewChat: {
          enabled: false,
          text: ""
        },
        onInactivityTimeout: {
          enabled: false,
          text: ""
        },
        onMaxDurationTimeout: {
          enabled: false,
          text: ""
        }
      },
      timeouts:{
        maxDuration: {
            "enabled": true,
            "durationSecs":300
        }, 
      }
    });
    // const config = {
    //   id: "h12312312!",
    //   prompt: {
    //     text:"sample text"
    //   }
    // }
    return NextResponse.json({ 
      configId: config.id, 
      prompt: config.prompt?.text, 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating config:', error);
    return NextResponse.json({ error: 'Failed to create config' }, { status: 500 });
  }
}
