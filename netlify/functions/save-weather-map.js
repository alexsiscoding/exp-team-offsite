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
