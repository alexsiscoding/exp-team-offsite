const SABOTEUR_NAMES = {
  judge:         "The Judge",
  avoider:       "Avoider",
  controller:    "Controller",
  hyperAchiever: "Hyper-Achiever",
  hyperRational: "Hyper-Rational",
  hyperVigilant: "Hyper-Vigilant",
  pleaser:       "Pleaser",
  restless:      "Restless",
  stickler:      "Stickler",
  victim:        "Victim",
};

const MAX_SCORES = {
  judge:         6, avoider:       4, controller:    4,
  hyperAchiever: 4, hyperRational: 4, hyperVigilant: 4,
  pleaser:       4, restless:      4, stickler:      4, victim:        4,
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { name, top, scores } = JSON.parse(event.body);

  const topNames = top.map(k => SABOTEUR_NAMES[k] || k).join(", ");

  const scoreLines = Object.entries(scores)
    .map(([k, v]) => ({ key: k, pct: Math.round((v / MAX_SCORES[k]) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .map(({ key, pct }) => `${SABOTEUR_NAMES[key] || key}: ${pct}%`)
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
      text: `Name: ${name}\n\nTop 3: ${topNames}\n\nAll scores:\n${scoreLines}`,
    }),
  });

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
