const fs = require('fs');

let content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

// The new severity colors: High = Coral, Medium = Amber, Low = Emerald
content = content.replace(
  "const severityData = [\n    { name: 'High', value: severityCount.HIGH, color: '#ef4444' },\n    { name: 'Medium', value: severityCount.MEDIUM, color: '#f59e0b' },\n    { name: 'Low', value: severityCount.LOW, color: '#3b82f6' }\n  ];",
  `const severityData = [
    { name: 'High', value: severityCount.HIGH, color: 'url(#colorHigh)' },
    { name: 'Medium', value: severityCount.MEDIUM, color: 'url(#colorMedium)' },
    { name: 'Low', value: severityCount.LOW, color: 'url(#colorLow)' }
  ];`
);

// Add defs to PieChart
content = content.replace(
  '<PieChart>',
  `<PieChart>
                    <defs>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#d97706" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                    </defs>`
);

// Add defs to BarChart and use it
content = content.replace(
  '<BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>',
  `<BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={1}/>
                    </linearGradient>
                  </defs>`
);
content = content.replace(
  '<Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />',
  '<Bar dataKey="value" fill="url(#barGradient)" radius={[0, 4, 4, 0]} barSize={24} className="hover:opacity-80 transition-opacity" />'
);

// Change UI colors
content = content.replace(/bg-blue-100 text-blue-800/g, 'bg-slate-800 text-slate-100 dark:bg-slate-700');
content = content.replace(/bg-blue-50 text-blue-600/g, 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100');
content = content.replace(/bg-red-50 text-red-600/g, 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400');
content = content.replace(/bg-emerald-50 text-emerald-600/g, 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400');

// Shadows & cards
content = content.replace(/shadow-sm/g, 'shadow-lg shadow-slate-200/50 dark:shadow-none');

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', content);
console.log('Analytics updated.');
