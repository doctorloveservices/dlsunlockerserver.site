const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace localStorage initialization for services
code = code.replace(
  /const \[services, setServices\] = useState<IMEIService\[\]>\(\(\) => \{[^]*?return ALL_SERVICES;\n  \}\);/,
  "const [services, setServices] = useState<IMEIService[]>([]);"
);

// Replace slides initialization
code = code.replace(
  /const \[slides, setSlides\] = useState<SlideItem\[\]>\(\(\) => \{[^]*?return INITIAL_SLIDES;\n  \}\);/,
  "const [slides, setSlides] = useState<SlideItem[]>([]);"
);

// Replace websiteLive
code = code.replace(
  /const \[websiteLive, setWebsiteLive\] = useState<boolean>\(\(\) => \{[^]*?return true;\n  \}\);/,
  "const [websiteLive, setWebsiteLive] = useState<boolean>(true);"
);

// We'll leave user, orders, announcements out of DB for now or just wipe them from localStorage reliance.
code = code.replace(
  /const \[user, setUser\] = useState<User>\(\(\) => \{[^]*?return INITIAL_USER;\n  \}\);/,
  "const [user, setUser] = useState<User>(INITIAL_USER);"
);
code = code.replace(
  /const \[orders, setOrders\] = useState<Order\[\]>\(\(\) => \{[^]*?return \[\];\n  \}\);/,
  "const [orders, setOrders] = useState<Order[]>([]);"
);
code = code.replace(
  /const \[announcements, setAnnouncements\] = useState<Announcement\[\]>\(\(\) => \{[^]*?return INITIAL_ANNOUNCEMENTS;\n  \}\);/,
  "const [announcements, setAnnouncements] = useState<Announcement[]>([]);"
);

fs.writeFileSync('src/App.tsx', code);
