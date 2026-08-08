const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const initial = \{ services: ALL_SERVICES, websiteLive: true \};/,
  "const initial = { services: ALL_SERVICES, websiteLive: true, orders: [], users: [], announcements: [] };"
);

code = code.replace(
  /return \{ services: ALL_SERVICES, websiteLive: true \};/,
  "return { services: ALL_SERVICES, websiteLive: true, orders: [], users: [], announcements: [] };"
);

code = code.replace(
  /if \(typeof data.websiteLive === 'boolean'\) db.websiteLive = data.websiteLive;/,
  "if (typeof data.websiteLive === 'boolean') db.websiteLive = data.websiteLive;\n  if (data.orders) db.orders = data.orders;\n  if (data.users) db.users = data.users;\n  if (data.announcements) db.announcements = data.announcements;"
);

fs.writeFileSync('server.ts', code);
