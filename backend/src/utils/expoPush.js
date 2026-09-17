const axios = require('axios');

/** Fire-and-forget push notification to a single Expo push token. */
async function sendExpoPush(token, title, body, data = {}) {
  if (!token) return;
  try {
    await axios.post('https://exp.host/--/api/v2/push/send', { to: token, title, body, data });
  } catch (err) {
    console.error('Push notification failed:', err.message);
  }
}

module.exports = { sendExpoPush };
