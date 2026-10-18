const fs = require('fs');

let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

// 1. Import useAuth
content = content.replace("import { useTheme } from '../contexts/ThemeContext';", "import { useTheme } from '../contexts/ThemeContext';\nimport { useAuth } from '../contexts/AuthContext';");

// 2. Add auth context to component
content = content.replace("const { theme, setTheme } = useTheme();", "const { theme, setTheme } = useTheme();\n  const { user } = useAuth();");

// 3. Update recentQueries state initialization
content = content.replace(/const \[recentQueries, setRecentQueries\] = useState<string\[\]>\(\(\) => \{[\s\S]*?\}\);/, "const [recentQueries, setRecentQueries] = useState<string[]>([]);");

// 4. Add useEffect to fetch queries
const fetchQueriesEffect = `
  useEffect(() => {
    const fetchQueries = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/queries', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (res.ok) {
          const data = await res.json();
          setRecentQueries(data);
        }
      } catch (err) {
        console.error("Failed to fetch queries:", err);
      }
    };
    fetchQueries();
  }, [user]);
`;
content = content.replace("const getWelcomeMessage = () => {", fetchQueriesEffect + "\n  const getWelcomeMessage = () => {");

// 5. Update saving query to post it
const saveQueryLogic = `
    const currentQuery = query.trim();
    if (currentQuery) {
      const updated = [currentQuery, ...recentQueries.filter(q => q !== currentQuery)].slice(0, 15);
      setRecentQueries(updated);
      
      if (user) {
        user.getIdToken().then(token => {
          fetch('/api/queries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ queryText: currentQuery })
          }).catch(err => console.error("Failed to save query:", err));
        });
      }
    }
`;
content = content.replace(/const currentQuery = query\.trim\(\);\s*if \(currentQuery\) \{[\s\S]*?sessionStorage\.setItem\('recentQueries', JSON\.stringify\(updated\)\);\s*\}/, saveQueryLogic);

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
