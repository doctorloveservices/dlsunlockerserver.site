const fs = require('fs');
let code = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

code = code.replace(
  /let matchedProfile: UserProfile \| null = null;[^]*?catch \{\s*\}\s*if \(matchedProfile\) \{/g,
  `let matchedProfile: UserProfile | null = null;
            try {
              const res = await fetch('/api/db');
              const resData = await res.json();
              if (resData.success && resData.data && Array.isArray(resData.data.users)) {
                matchedProfile = resData.data.users.find((u: any) => 
                  (u.email && u.email.toLowerCase() === cleanInput) ||
                  (u.username && u.username.toLowerCase() === cleanInput)
                ) || null;
              }
            } catch (e) {}
            if (matchedProfile) {`
);

// We need to mark handleSubmit as async since we await fetch.
code = code.replace(
  /const handleSubmit = \(e: React\.FormEvent\) => \{/g,
  "const handleSubmit = async (e: React.FormEvent) => {"
);

// And fix the register path
code = code.replace(
  /try \{\s*const existingListRaw = localStorage\.getItem\('dls_users_list'\);[^]*?\}\s*onLogin/g,
  `try {
          const res = await fetch('/api/db');
          const resData = await res.json();
          let currentList: UserProfile[] = [];
          if (resData.success && resData.data && Array.isArray(resData.data.users)) {
            currentList = resData.data.users;
          }
          currentList = currentList.filter((u: any) => u.email.toLowerCase() !== cleanInput.toLowerCase());
          currentList.push(newRegisteredUser);
          await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users: currentList })
          });
        } catch (e) {
          console.error('Failed to sync new user', e);
        }

        onLogin`
);

fs.writeFileSync('src/components/AuthModal.tsx', code);
