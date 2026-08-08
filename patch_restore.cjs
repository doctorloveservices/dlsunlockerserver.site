const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const migrationHook = `
  // Migration hook to restore products and data from localStorage
  React.useEffect(() => {
    const migrateData = async () => {
      let needsRestore = false;
      const dbUpdate: any = {};
      
      try {
        const savedServices = localStorage.getItem('dls_services');
        if (savedServices) {
          const parsed = JSON.parse(savedServices);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.services = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      try {
        const savedOrders = localStorage.getItem('dls_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.orders = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      try {
        const savedUsers = localStorage.getItem('dls_users_list');
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.users = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      try {
        const savedAnnouncements = localStorage.getItem('dls_announcements');
        if (savedAnnouncements) {
          const parsed = JSON.parse(savedAnnouncements);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.announcements = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      if (needsRestore) {
        try {
          const res = await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbUpdate)
          });
          if (res.ok) {
            // Remove them so we don't overwrite newer data on next reload
            localStorage.removeItem('dls_services');
            localStorage.removeItem('dls_orders');
            localStorage.removeItem('dls_users_list');
            localStorage.removeItem('dls_announcements');
            
            // Re-sync UI state
            if (dbUpdate.services) setServices(dbUpdate.services);
            if (dbUpdate.orders) setOrders(dbUpdate.orders);
            if (dbUpdate.announcements) setAnnouncements(dbUpdate.announcements);
          }
        } catch (err) {
          console.error("Migration failed", err);
        }
      }
    };

    migrateData();
  }, []);
`;

code = code.replace(
  /export default function App\(\) \{\s*const \[activeTab, setActiveTab\] = useState<string>\('home'\);/,
  "export default function App() {\n  const [activeTab, setActiveTab] = useState<string>('home');\n" + migrationHook
);

fs.writeFileSync('src/App.tsx', code);
