const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const dbEndpoints = `
app.get("/api/db", (req, res) => {
  const db = getDB();
  res.json({
    success: true,
    data: db
  });
});

app.post("/api/db", (req, res) => {
  const data = req.body;
  const db = getDB();
  if (data.services) db.services = data.services;
  if (data.slides) db.slides = data.slides;
  if (typeof data.websiteLive === 'boolean') db.websiteLive = data.websiteLive;
  
  saveDB(db);
  res.json({ success: true, data: db });
});
`;

code = code.replace(
  /app\.get\("\/api\/services", \(req, res\) => \{/,
  dbEndpoints + '\napp.get("/api/services", (req, res) => {'
);

fs.writeFileSync('server.ts', code);
