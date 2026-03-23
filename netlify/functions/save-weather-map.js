exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { name, sunny, overcast, stormy, clearup } = JSON.parse(event.body);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      mcp_servers: [{ type: "url", url: "https://mcp.notion.com/mcp", name: "notion" }],
      messages: [{
        role: "user",
        content: `Add a new row to the Notion database with ID cf3e054a37af4f919df6b9693031e9dc with these exact values:
- Name: ${name}
- Sunny: ${sunny}
- Overcast: ${overcast}
- Stormy: ${stormy}
- Clearup: ${clearup}

Just create the row, nothing else.`
      }]
    })
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data).slice(0, 500));
  if (!res.ok) return { statusCode: 500, body: JSON.stringify({ error: data }) };
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
