// POST /api/submit-order -> forwards the order JSON to Apps Script's doPost
// (as { action: "submitOrder", data: {...} }), server-to-server, and relays
// the JSON result straight back. The browser never sees script.google.com.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const base = process.env.APPS_SCRIPT_URL;
  if (!base) {
    res.status(500).json({ success: false, error: 'Server misconfigured: APPS_SCRIPT_URL environment variable is not set.' });
    return;
  }

  try {
    const upstream = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submitOrder', data: req.body })
    });
    const json = await upstream.json();
    res.status(200).json(json);
  } catch (err) {
    res.status(502).json({ success: false, error: 'Unable to reach the order system right now. Please try again shortly.' });
  }
}
