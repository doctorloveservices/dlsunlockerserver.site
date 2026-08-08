const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanelModal.tsx', 'utf8');

code = code.replace(
  /const \[usersList, setUsersList\] = useState<UserProfile\[\]>\(\(\) => \{[^]*?\}\);/g,
  `const [usersList, setUsersList] = useState<UserProfile[]>([]);
  
  // Sync users
  React.useEffect(() => {
    fetch('/api/db').then(res => res.json()).then(resData => {
      if(resData.success && resData.data && Array.isArray(resData.data.users)) {
        setUsersList(resData.data.users);
      }
    }).catch(() => {});
  }, []);`
);

code = code.replace(
  /try \{\s*localStorage\.setItem\('dls_users_list', JSON\.stringify\(newUsers\)\);\s*\} catch \(err\) \{\s*console\.error\('Failed to update dls_users_list in localStorage', err\);\s*\}/g,
  `fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: newUsers }),
    }).catch(() => {});`
);

fs.writeFileSync('src/components/AdminPanelModal.tsx', code);
