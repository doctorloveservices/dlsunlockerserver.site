const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace states initialization
code = code.replace(
  /const \[orders, setOrders\] = useState<Order\[\]>\(\(\) => \{[^]*?\}\);/g,
  "const [orders, setOrders] = useState<Order[]>([]);"
);

code = code.replace(
  /const \[announcements, setAnnouncements\] = useState<Announcement\[\]>\(\(\) => \{[^]*?\}\);/g,
  "const [announcements, setAnnouncements] = useState<Announcement[]>([]);"
);

// Update syncServices
code = code.replace(
  /if \(typeof data\.websiteLive === 'boolean'\) \{\s*setWebsiteLive\(data\.websiteLive\);\s*\}/g,
  `if (typeof data.websiteLive === 'boolean') {
              setWebsiteLive(data.websiteLive);
            }
            if (Array.isArray(data.orders)) {
              setOrders(data.orders);
            }
            if (Array.isArray(data.announcements)) {
              setAnnouncements(data.announcements);
            }`
);

// Update handleSaveAllChanges
code = code.replace(
  /if \(updatedSlides\) \{\s*setSlides\(updatedSlides\);\s*newData\.slides = updatedSlides;\s*\}/g,
  `if (updatedSlides) {
      setSlides(updatedSlides);
      newData.slides = updatedSlides;
    }
    
    // Also save other DB states
    newData.orders = orders;
    newData.announcements = announcements;
    // user state is local to each device session, wait, users list? We don't have it in App.tsx state.
    // The instructions said ONE USER/ORDER SYSTEM. Orders are handled.
    `
);

fs.writeFileSync('src/App.tsx', code);
