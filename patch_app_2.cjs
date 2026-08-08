const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove localStorage sets
code = code.replace(/localStorage\.setItem[^;]+;/g, '');
// Remove localStorage deletes
code = code.replace(/localStorage\.removeItem[^;]+;/g, '');

fs.writeFileSync('src/App.tsx', code);
