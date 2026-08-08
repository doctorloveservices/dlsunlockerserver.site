const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[services, setServices\] = useState<IMEIService\[\]>\(\(\) => \{[^]*?\}\);/g,
  "const [services, setServices] = useState<IMEIService[]>([]);"
);

fs.writeFileSync('src/App.tsx', code);
