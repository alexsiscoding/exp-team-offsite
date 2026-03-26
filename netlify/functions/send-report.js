exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { weatherMaps, saboteurResults, aiWrapUp } = JSON.parse(event.body);

  const weatherSection = Object.entries(weatherMaps)
    .map(([name, zones]) =>
      `${name}\n` +
      `  ☀️  Sunny: ${zones.sunny}\n` +
      `  ☁️  Overcast: ${zones.overcast}\n` +
      `  ⛈️  Stormy: ${zones.stormy}\n` +
      `  🌈  Clear-up: ${zones.clearup}`
    ).join("\n\n");

  const sabSection = Object.entries(saboteurResults)
    .map(([name, result]) => `${name}: ${result.top.join(", ")}`)
    .join("\n");

const emailBody = `TEAM WEATHER MAPS\n${"─".repeat(40)}\n\n${weatherSection}\n\n\nSABOTEUR TOP 3s\n${"─".repeat(40)}\n\n${sabSection}`;
  
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "offsite@resend.dev",
      to: "abass@notablecap.com",
      subject: "Experience Team — Full Offsite Report",
      text: emailBody,
    }),
  });

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
