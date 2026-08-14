// GET / -> fetches the Apps Script request-delivery form server-side and
// returns it as-is. The browser only ever talks to your own domain; this
// function is the only thing that ever calls script.google.com.

module.exports = async function handler(req, res) {
  const base = process.env.APPS_SCRIPT_URL;
  if (!base) {
    res.status(500).send('Server misconfigured: APPS_SCRIPT_URL environment variable is not set.');
    return;
  }

  try {
    const upstream = await fetch(base, { redirect: 'follow' });
    const html = await upstream.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(upstream.status).send(html);
  } catch (err) {
    res.status(502).send('Unable to load the delivery form right now. Please try again shortly.');
  }
}
