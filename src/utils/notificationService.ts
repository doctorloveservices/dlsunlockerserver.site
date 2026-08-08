import { NotificationLogItem, Order } from '../types';

/**
 * Mock Email Notification Service
 * Logs order status updates and notifications to console with formatted styles
 * and returns structured log items for the Admin Panel.
 */
export function sendOrderEmailNotification(
  order: Order,
  recipientEmail: string,
  newStatus: Order['status'],
  codeOrMessage?: string
): NotificationLogItem {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  let subject = `Order #${order.orderNumber} Status Update: ${newStatus.toUpperCase()}`;
  let body = `Hello,\n\nYour order #${order.orderNumber} for "${order.serviceName}" (IMEI/SN: ${order.imei || order.serialNumber || 'N/A'}) status has been updated to: ${newStatus.toUpperCase()}.`;

  if (newStatus === 'completed') {
    subject = `Order #${order.orderNumber} COMPLETED - Unlock Code / Result Ready`;
    body = `Great news! Your order #${order.orderNumber} for "${order.serviceName}" is COMPLETED.\n\nResult/Code: ${codeOrMessage || order.code || 'SUCCESS'}\nSubmitted IMEI: ${order.imei || order.serialNumber || 'N/A'}\n\nThank you for choosing dlsunlockerserver.site!`;
  } else if (newStatus === 'rejected') {
    subject = `Order #${order.orderNumber} REJECTED / REFUNDED`;
    body = `Notice: Your order #${order.orderNumber} for "${order.serviceName}" could not be processed and has been marked REJECTED. Credits have been returned to your account.\n\nReason/Note: ${codeOrMessage || 'Service rejected by provider.'}`;
  } else if (newStatus === 'waiting_carrier') {
    subject = `Order #${order.orderNumber} Waiting for Carrier Response`;
    body = `Update: Order #${order.orderNumber} is currently pending carrier validation response. We will update you as soon as unlock code is generated.`;
  }

  // Console logging for verification
  console.log(
    `%c[EMAIL NOTIFICATION SERVICE]%c Sent to: %c${recipientEmail || 'customer@dlsunlockerserver.site'}%c\nSubject: "${subject}"\nBody:\n${body}`,
    'background: #0f766e; color: #ffffff; font-weight: bold; padding: 2px 6px; rounded: 4px;',
    'color: #94a3b8;',
    'color: #38bdf8; font-weight: bold;',
    'color: #e2e8f0;'
  );

  const logItem: NotificationLogItem = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    recipientEmail: recipientEmail || 'customer@dlsunlockerserver.site',
    subject,
    body,
    status: 'sent',
    orderId: order.id,
    orderNumber: order.orderNumber,
  };

  return logItem;
}

export function sendNewOrderNotification(
  order: Order,
  recipientEmail: string
): NotificationLogItem {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const subject = `Order Confirmation #${order.orderNumber} - ${order.serviceName}`;
  const body = `Thank you for your order!\n\nOrder #: ${order.orderNumber}\nService: ${order.serviceName}\nIMEI/SN: ${order.imei || order.serialNumber || 'N/A'}\nCost: $${order.cost.toFixed(2)}\nStatus: IN PROCESS\n\nWe are processing your request at dlsunlockerserver.site.`;

  console.log(
    `%c[EMAIL NOTIFICATION SERVICE]%c New Order Confirmation -> %c${recipientEmail || 'customer@dlsunlockerserver.site'}%c\nSubject: "${subject}"\nBody:\n${body}`,
    'background: #0369a1; color: #ffffff; font-weight: bold; padding: 2px 6px; rounded: 4px;',
    'color: #94a3b8;',
    'color: #38bdf8; font-weight: bold;',
    'color: #e2e8f0;'
  );

  return {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    recipientEmail: recipientEmail || 'customer@dlsunlockerserver.site',
    subject,
    body,
    status: 'sent',
    orderId: order.id,
    orderNumber: order.orderNumber,
  };
}
