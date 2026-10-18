const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

// Replace the messed up ternary for emergency mode
content = content.replace(/\? 'ଜରୁରୀକାଳୀନ ସହାୟତା ମୋଡ୍ \| ଜରୁରୀକାଳୀନ ପ୍ରକ୍ରିୟା, ସ୍ଥାନାନ୍ତର ଏବଂ ପ୍ରାଥମିକ ଚିକିତ୍ସା ପ୍ରୋଟୋକଲ୍ ପାଇଁ ମୁଁ ଷ୍ଟାଣ୍ଡବାଇରେ ଅଛି \| ତୁମର ଅବସ୍ଥା କ’ଣ\?'/g, "");

// Replace the messed up ternary for inspector mode
content = content.replace(/\? 'ସୁରକ୍ଷା ନିରୀକ୍ଷକ AI \| କର୍ମକ୍ଷେତ୍ରର ବିପଦ ଚିହ୍ନଟ କରିବାରେ ଏବଂ ଅନୁପାଳନ ଯାଞ୍ଚ କରିବାରେ ମୁଁ ସାହାଯ୍ୟ କରିପାରିବି \| ଆପଣ କେଉଁ କ୍ଷେତ୍ର ଯାଞ୍ଚ କରୁଛନ୍ତି\?'/g, "");

// Replace the messed up ternary for default mode
content = content.replace(/\? 'ନମସ୍କାର! ମୁଁ ଅଇଲି AI ସୁରକ୍ଷା ସହାୟକ ଅଟେ | OIL ଏବଂ OISD ନିର୍ଦ୍ଦେଶାବଳୀ ଆଧାରରେ ନିୟମାବଳୀ, PPE, କିମ୍ବା ଉତ୍ତମ ଅଭ୍ୟାସ ବିଷୟରେ ମୋତେ କିଛି ପଚାରନ୍ତୁ |'/g, "");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
