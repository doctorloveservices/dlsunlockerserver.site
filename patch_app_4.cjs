const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const syncServices = \(\) => \{[^]*?\}\);[^]*?\};/,
  `const syncServices = () => {
      fetch('/api/db')
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            const data = resData.data;
            if (Array.isArray(data.services) && data.services.length > 0) {
              setServices(data.services);
            }
            if (typeof data.websiteLive === 'boolean') {
              setWebsiteLive(data.websiteLive);
            }
          }
        })
        .catch(() => {});
    };`
);

// Fix handleSaveAllChanges
code = code.replace(
  /const handleSaveAllChanges = \(updatedServices\?: IMEIService\[\], updatedSlides\?: SlideItem\[\]\) => \{[^]*?if \(updatedSlides\) setSlides\(updatedSlides\);/g,
  `const handleSaveAllChanges = (updatedServices?: IMEIService[], updatedSlides?: SlideItem[]) => {
    const newData: any = {};
    if (updatedServices) {
      setServices(updatedServices);
      newData.services = updatedServices;
    } else {
      newData.services = services;
    }
    
    if (updatedSlides) {
      setSlides(updatedSlides);
      newData.slides = updatedSlides;
    }

    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    }).catch(() => {});`
);

fs.writeFileSync('src/App.tsx', code);
