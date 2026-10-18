const fs = require('fs');
let trans = fs.readFileSync('src/lib/translations.ts', 'utf8');

// The file exports `translations` object containing `en`, `hi`, `or`.
// I will use regex or string manipulation to remove `or: { ... }`.
const orIndex = trans.indexOf(',\n  or: {');
if (orIndex !== -1) {
  trans = trans.substring(0, orIndex) + '\n};\n';
  fs.writeFileSync('src/lib/translations.ts', trans);
}
