const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const additions = `
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark ::-webkit-scrollbar-thumb {
  background-color: #334155;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.dark * {
  scrollbar-color: #334155 transparent;
}

/* Fix mobile tap highlights */
* {
  -webkit-tap-highlight-color: transparent;
}
`;

if (!css.includes('scroll-behavior: smooth')) {
  fs.writeFileSync('src/index.css', css + additions);
  console.log('Added smooth scrolling and scrollbars to index.css');
}
