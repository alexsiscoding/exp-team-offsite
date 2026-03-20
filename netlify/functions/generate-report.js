exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  const { summaries } = JSON.parse(event.body);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are wrapping up a team icebreaker activity called the Team Weather Map for the Experience Team at Notable Capital. Each person filled in four zones: Sunny (at their best), Overcast (early stress signals), Stormy (when overwhelmed), and Clear-up (how to help them).\n\nHere are all the responses:\n\n${summaries}\n\nWrite a warm, specific "Team Weather Report" wrap-up script the team reads aloud. Structure it in exactly three parts:\n1. "Our High-Pressure System" — 2-3 common themes from Sunny.\n2. "Incoming Clouds" — 1-2 common stress patterns from Overcast and Stormy.\n3. "The Safety Umbrella" — most actionable commitments from Clear-up.\n\nEnd with one short genuine closing thought (2-3 sentences). Warm, grounded, specific. No placeholder brackets.`
      }]
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: data.content[0].text })
  };
};
