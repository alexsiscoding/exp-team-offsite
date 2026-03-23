exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { name, top, scores } = JSON.parse(event.body);

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
        content: `Add a new row to the Notion database with ID b63a2475b1cf4fa6b597f48585996b52 with these exact values:
- Name: ${name}
- Top1: ${top[0] || ""}
- Top2: ${top[1] || ""}
- Top3: ${top[2] || ""}
- Scores: ${JSON.stringify(scores)}

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
