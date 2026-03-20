exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Method not allowed" };
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
