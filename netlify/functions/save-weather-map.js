exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { name, sunny, overcast, stormy, clearup } = JSON.parse(event.body);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "offsite@resend.dev",
      to: "abass@notablecap.com",
      subject: `Weather Map — ${name}`,
      text: `Name: ${name}\n\nSunny: ${sunny}\n\nOvercast: ${overcast}\n\nStormy: ${stormy}\n\nClear-up: ${clearup}`,
    }),
  });

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
