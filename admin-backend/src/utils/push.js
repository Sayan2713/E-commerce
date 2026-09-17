const axios = require('axios');

const STATUS_MESSAGES = {
  PACKED: 'Your order has been packed and will ship soon.',
  SHIPPED: 'Your order has shipped!',
  OUT_FOR_DELIVERY: 'Your order is out for delivery.',
  DELIVERED: 'Your order has been delivered. Your invoice is ready.',
  CANCELLED: 'Your order was cancelled.',
  RETURNED: 'Your return has been processed.',
};

/** Fire-and-forget Expo push notification for an order status change. */
async function sendOrderStatusPush(user, order, status) {
  if (!user?.expoPushToken) return;
  const body = STATUS_MESSAGES[status];
  if (!body) return;

  try {
    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: user.expoPushToken,
      title: `Order ${order.orderId}`,
      body,
      data: { orderId: order.orderId, status },
    });
  } catch (err) {
    console.error('Push notification failed:', err.message);
  }
}

module.exports = { sendOrderStatusPush };
