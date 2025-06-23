import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// IMPORTANT: Ensure your OpenAI API key is set as a Supabase Secret named OPENAI_API_KEY
// Go to Project Settings > Edge Functions > Secrets in Supabase dashboard
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable not set.");
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://reimundovalentin.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://reimundovalentin.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json",
  };

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt' in request body" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.json();
      console.error("OpenAI API Error:", errorBody);
      return new Response(JSON.stringify({ error: `OpenAI API Error: ${errorBody.error?.message || openaiResponse.statusText}` }), {
        status: openaiResponse.status,
        headers: CORS_HEADERS,
      });
    }

    const openaiData = await openaiResponse.json();
    const aiResponseContent = openaiData.choices[0]?.message?.content || "No response from AI.";

    return new Response(JSON.stringify({ response: aiResponseContent }), {
      headers: CORS_HEADERS,
      status: 200,
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: `Internal server error: ${error.message}` }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}); 