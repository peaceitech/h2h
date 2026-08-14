// POST /api/track-lookup -> forwards { action: "getOrder", trackingId }
// to Apps Script's doPost, server-to-server, relays the JSON result back.

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
      body: JSON.stringify({ action: 'getOrder', trackingId: req.body.trackingId })
    });
    const json = await upstream.json();
    res.status(200).json(json);
  } catch (err) {
    res.status(502).json({ success: false, error: 'Unable to reach the tracking system right now. Please try again shortly.' });
  }
}
