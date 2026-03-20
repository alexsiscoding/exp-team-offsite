exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  const { name, top, scores } = JSON.parse(event.body);

  const res = await fetch(`https://api.airtable.com/v0/appDdGY1mWixS5cTb/Saboteurs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        Name: name,
        Top1: top[0] || "",
        Top2: top[1] || "",
        Top3: top[2] || "",
        Scores: JSON.stringify(scores),
        Timestamp: new Date().toISOString(),
      }
    })
  });

  const data = await res.json();
  if (!res.ok) return { statusCode: 500, body: JSON.stringify(data) };
  return { statusCode: 200, body: JSON.stringify({ success: true, id: data.id }) };
};
