exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { submissions, sabResults } = JSON.parse(event.body);

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
      mcp_servers: [{
        type: "url",
        url: "https://mcp.notion.com/mcp",
        name: "notion"
      }],
      messages: [{
        role: "user",
        content: `Update the Notion page "Experience Team Offsite 2026" (page ID: 329f969c-c924-8161-af22-e83796a9c38a). 
        
For each person listed below, find their existing sub-page and update it with their Weather Map responses and Saboteur results.

${JSON.stringify({ submissions, sabResults }, null, 2)}

Update each person's page — don't create new ones, just update the existing "To be filled in" placeholders with their actual responses. Use the actual text — don't summarize or paraphrase.`
      }]
    })
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true })
  };
};
