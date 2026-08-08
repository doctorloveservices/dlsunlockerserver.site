const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[slides, setSlides\] = useState<SlideItem\[\]>\(\(\) => \{[^]*?\}\);/g,
  "const [slides, setSlides] = useState<SlideItem[]>([]);"
);

code = code.replace(
  /const \[websiteLive, setWebsiteLive\] = useState<boolean>\(\(\) => \{[^]*?\}\);/g,
  "const [websiteLive, setWebsiteLive] = useState<boolean>(true);"
);

fs.writeFileSync('src/App.tsx', code);
