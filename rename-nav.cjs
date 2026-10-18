const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

content = content.replace(/label: t\('nav\.analytics'\)/g, "label: 'Safety Analytics & SIF'");
content = content.replace(/label: t\('nav\.analyzer'\)/g, "label: 'Report Analyzer'");
content = content.replace(/label: t\('side\.help'\)/g, "label: 'Help & Methodology'");

fs.writeFileSync('src/components/Sidebar.tsx', content);

let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navContent = navContent.replace(/label: t\('nav\.analytics'\)/g, "label: 'Safety Analytics & SIF'");
navContent = navContent.replace(/label: t\('nav\.analyzer'\)/g, "label: 'Report Analyzer'");
fs.writeFileSync('src/components/Navbar.tsx', navContent);
