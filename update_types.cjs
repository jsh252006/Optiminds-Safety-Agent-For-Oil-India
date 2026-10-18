const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(
  /sifConfidence\?: number;/,
  "sifConfidence?: number;\n  sifExplanation?: {\n    reasoning: string;\n    evidence: string[];\n  };"
);
fs.writeFileSync('src/types.ts', types);
