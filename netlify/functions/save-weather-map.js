exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON", detail: e.message }) };
  }

  const { name, sunny, overcast, stormy, clearup } = body;

  if (!process.env.AIRTABLE_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "AIRTABLE_TOKEN not set" }) };
  }

  console.log("Token present:", !!process.env.AIRTABLE_TOKEN);
  console.log("Saving weather map for:", name);

  const res = await fetch(`https://api.airtable.com/v0/appDdGY1mWixS5cTb/Weather%20Map`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: { Name: name, Sunny: sunny, Overcast: overcast, Stormy: stormy, Clearup: clearup, Timestamp: new Date().toISOString() }
    })
  });

  const data = await res.json();
  console.log("Airtable response status:", res.status);
  console.log("Airtable response body:", JSON.stringify(data));

  if (!res.ok) return { statusCode: 500, body: JSON.stringify({ error: "Airtable error", detail: data }) };
  return { statusCode: 200, body: JSON.stringify({ success: true, id: data.id }) };
};
