const fs = require('fs');

// Analytics Dashboard Updates
let adContent = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

// Update severity colors: High = Coral Red (#EF4444), Medium = Amber (#F59E0B), Low = Emerald Green (#10B981)
adContent = adContent.replace(/#f43f5e/g, '#ef4444');
adContent = adContent.replace(/#e11d48/g, '#dc2626');

// Replace general purple/fuchsia UI headers with Deep Teal (#0F766E -> teal-700) or Navy
adContent = adContent.replace(/from-purple-500 to-fuchsia-600/g, 'from-teal-600 to-teal-800');
adContent = adContent.replace(/shadow-purple-500\/20/g, 'shadow-teal-700/20');

// Replace rose with coral red
adContent = adContent.replace(/from-rose-500 to-red-600/g, 'from-red-500 to-red-700');
adContent = adContent.replace(/shadow-rose-500\/20/g, 'shadow-red-500/20');

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', adContent);

// Fix Home Dashboard gradients to use the industrial palette
let hdContent = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');
hdContent = hdContent.replace(/from-blue-600 to-indigo-600/g, 'from-[#1A365D] to-[#0F766E]');
hdContent = hdContent.replace(/from-blue-500 to-indigo-600/g, 'from-[#1A365D] to-[#334155]');
hdContent = hdContent.replace(/from-emerald-500 to-teal-600/g, 'from-teal-500 to-teal-700');
hdContent = hdContent.replace(/from-purple-500 to-fuchsia-600/g, 'from-cyan-500 to-cyan-700');
hdContent = hdContent.replace(/from-amber-500 to-orange-600/g, 'from-orange-400 to-orange-600');
hdContent = hdContent.replace(/from-cyan-500 to-blue-600/g, 'from-[#1A365D] to-[#0F766E]');
hdContent = hdContent.replace(/from-rose-500 to-red-600/g, 'from-red-500 to-red-700');
hdContent = hdContent.replace(/from-indigo-500 to-blue-600/g, 'from-[#334155] to-slate-700');

fs.writeFileSync('src/components/HomeDashboard.tsx', hdContent);
console.log('Analytics & Home updated.');
