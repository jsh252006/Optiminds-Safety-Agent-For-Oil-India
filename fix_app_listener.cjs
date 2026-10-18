const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  useEffect\(\(\) => \{\n    const handleGlobalClick.*?return \(\) => document\.removeEventListener\('click', handleGlobalClick, true\);\n  \}, \[\]\);\n/s;
appContent = appContent.replace(regex, "");

fs.writeFileSync('src/App.tsx', appContent);
