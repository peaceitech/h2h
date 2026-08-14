// GET /label?id=HTH-CAET-0001 -> fetches the Apps Script printable tag
// server-side (?page=label&id=...) and returns it as-is.

module.exports = async function handler(req, res) {
  const base = process.env.APPS_SCRIPT_URL;
  if (!base) {
    res.status(500).send('Server misconfigured: APPS_SCRIPT_URL environment variable is not set.');
    return;
  }

  try {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    const target = `${base}?page=label${id ? '&id=' + encodeURIComponent(id) : ''}`;
    const upstream = await fetch(target, { redirect: 'follow' });
    const html = await upstream.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(upstream.status).send(html);
  } catch (err) {
    res.status(502).send('Unable to load the shipping tag right now. Please try again shortly.');
  }
}
