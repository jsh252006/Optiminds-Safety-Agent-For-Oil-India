const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="absolute top-\[-10%\] right-\[-10%\][\s\S]*?<\/div>\n      <\/div>/;
content = content.replace(regex, "");

fs.writeFileSync('src/App.tsx', content);
