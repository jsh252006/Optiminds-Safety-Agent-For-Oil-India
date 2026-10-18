const fs = require('fs');
let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');

const footer = `
      {/* Demo Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 pb-8 text-center">
        <p className="text-xs text-slate-500 font-medium italic">
          Note: For this SIH prototype demonstration, we use publicly available and/or synthetic sample reports because actual operational safety data is highly confidential.
        </p>
      </div>
    </div>
  );
}
`;

content = content.replace('    </div>\n  );\n}', footer);
fs.writeFileSync('src/components/HomeDashboard.tsx', content);
