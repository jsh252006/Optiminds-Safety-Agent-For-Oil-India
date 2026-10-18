const fs = require('fs');
let content = fs.readFileSync('src/components/MachineManager.tsx', 'utf8');

// 1. Update Machine interface
content = content.replace(
  "scheduleType?: 'None' | 'Turn On' | 'Turn Off';",
  "scheduleType?: 'None' | 'Turn On' | 'Turn Off' | 'Maintenance';"
);

// 2. Update useState type
content = content.replace(
  "const [scheduleType, setScheduleType] = useState<'None' | 'Turn On' | 'Turn Off'>('None');",
  "const [scheduleType, setScheduleType] = useState<'None' | 'Turn On' | 'Turn Off' | 'Maintenance'>('None');"
);

// 3. Update openModal signature and behavior
content = content.replace(
  "const openModal = (machine?: Machine) => {",
  "const openModal = (machine?: Machine, overrideSchedule?: 'Maintenance' | 'Turn Off') => {"
);

content = content.replace(
  "setScheduleType(machine.scheduleType || 'None');",
  "setScheduleType(overrideSchedule || machine.scheduleType || 'None');"
);

// 4. Update the select options
content = content.replace(
  '<option value="Turn Off">Schedule to Turn Off (Close)</option>',
  '<option value="Turn Off">Schedule to Turn Off (Close)</option>\n                        <option value="Maintenance">Schedule Maintenance (Close)</option>'
);

fs.writeFileSync('src/components/MachineManager.tsx', content);
console.log('patched');
