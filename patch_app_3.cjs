const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const syncServices = \(\) => \{[^]*?\}\);[^]*?\};/,
  `const syncServices = () => {
      fetch('/api/services')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
          }
        })
        .catch(() => {});
    };`
);

fs.writeFileSync('src/App.tsx', code);
