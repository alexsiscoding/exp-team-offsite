exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  const { name, sunny, overcast, stormy, clearup } = JSON.parse(event.body);

  const res = await fetch(`https://api.airtable.com/v0/appDdGY1mWixS5cTb/Weather%20Map`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        Name: name,
        Sunny: sunny,
        Overcast: overcast,
        Stormy: stormy,
        Clearup: clearup,
        Timestamp: new Date().toISOString(),
      }
    })
  });

  const data = await res.json();
  if (!res.ok) return { statusCode: 500, body: JSON.stringify(data) };
  return { statusCode: 200, body: JSON.stringify({ success: true, id: data.id }) };
};


// ── FILE 2: netlify/functions/save-saboteurs.js ───────────────────────────────
// Saves a single person's Saboteur results to Airtable instantly on completion

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


// ── FILE 3: netlify/functions/get-submissions.js ──────────────────────────────
// Reads all submissions from Airtable — used to load data on page load

exports.handler = async (event) => {
  const [weatherRes, sabRes] = await Promise.all([
    fetch(`https://api.airtable.com/v0/appDdGY1mWixS5cTb/Weather%20Map`, {
      headers: { "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}` }
    }),
    fetch(`https://api.airtable.com/v0/appDdGY1mWixS5cTb/Saboteurs`, {
      headers: { "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}` }
    })
  ]);

  const weatherData = await weatherRes.json();
  const sabData = await sabRes.json();

  const submissions = {};
  (weatherData.records || []).forEach(r => {
    submissions[r.fields.Name] = {
      sunny: r.fields.Sunny || "",
      overcast: r.fields.Overcast || "",
      stormy: r.fields.Stormy || "",
      clearup: r.fields.Clearup || "",
    };
  });

  const sabResults = {};
  (sabData.records || []).forEach(r => {
    if (!r.fields.Name) return;
    const top = [r.fields.Top1, r.fields.Top2, r.fields.Top3].filter(v => v && v !== "undefined");
    let scores = {};
    try { scores = JSON.parse(r.fields.Scores || "{}"); } catch(e) {}
    sabResults[r.fields.Name] = { top, scores };
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissions, sabResults })
  };
};


// ── FILE 4: netlify/functions/generate-report.js ─────────────────────────────
// Generates AI wrap-up script — unchanged, already works

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
