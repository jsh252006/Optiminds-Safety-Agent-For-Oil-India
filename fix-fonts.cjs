const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">',
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
);
fs.writeFileSync('index.html', indexHtml);

let indexCss = fs.readFileSync('src/index.css', 'utf8');
indexCss = indexCss.replace(
  '--font-sans: \'Inter\'',
  '--font-sans: \'Inter\'\n  --font-heading: \'Montserrat\''
);
// Also ensure Montserrat is applied to h1, h2, h3, h4, h5, h6
const headingStyles = `
h1, h2, h3, h4, h5, h6, .font-heading {
  font-family: 'Montserrat', sans-serif;
}
`;
if (!indexCss.includes('font-heading')) {
    indexCss += headingStyles;
}
fs.writeFileSync('src/index.css', indexCss);
console.log('Fonts updated successfully.');
