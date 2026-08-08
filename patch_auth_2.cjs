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

fs.writeFileSync('src/components/AuthModal.tsx', code);
