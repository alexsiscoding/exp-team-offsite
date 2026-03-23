exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { name, top, scores } = JSON.parse(event.body);

  const scoreLines = Object.entries(scores)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "offsite@resend.dev",
      to: "abass@notablecap.com",
      subject: `Saboteurs — ${name}`,
      text: `Name: ${name}\n\nTop 3: ${top.join(", ")}\n\nAll scores:\n${scoreLines}`,
    }),
  });

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
