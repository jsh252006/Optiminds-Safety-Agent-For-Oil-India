const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const regex = /Translate the output text into \$\{language\}\./;
const replacement = `CRITICAL LANGUAGE REQUIREMENT:
    You MUST translate the output text and respond ENTIRELY in \${language}.
    Even if the original report is in English, if the requested language is \${language}, your entire JSON response (including summary, findings, etc.) MUST be translated into \${language}. Do not use English unless citing a specific technical term.`;

server = server.replace(regex, replacement);
fs.writeFileSync('server.ts', server);
