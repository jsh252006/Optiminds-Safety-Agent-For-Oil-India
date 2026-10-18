const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

const newImports = `
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { db } from './src/db/index.ts';
import { queries } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
`;

serverContent = serverContent.replace('import { createServer as createViteServer } from "vite";', 'import { createServer as createViteServer } from "vite";' + newImports);

const newRoutes = `
// API Route for getting user queries
app.get("/api/queries", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: "User not found" });
    
    const userQueries = await db.select()
      .from(queries)
      .where(eq(queries.userId, req.dbUser.id))
      .orderBy(desc(queries.createdAt))
      .limit(15);
      
    res.json(userQueries.map(q => q.queryText));
  } catch (error: any) {
    console.error("Failed to fetch queries:", error);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// API Route for saving a query
app.post("/api/queries", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.dbUser) return res.status(401).json({ error: "User not found" });
    const { queryText } = req.body;
    
    if (!queryText || typeof queryText !== 'string') {
      return res.status(400).json({ error: "Invalid queryText" });
    }
    
    // Simple deduplication, could also be done on frontend
    const existing = await db.select()
      .from(queries)
      .where(eq(queries.queryText, queryText))
      .limit(1);
      
    if (existing.length === 0 || existing[0].userId !== req.dbUser.id) {
       await db.insert(queries).values({
         userId: req.dbUser.id,
         queryText: queryText
       });
    }
      
    res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to save query:", error);
    res.status(500).json({ error: "Failed to save query" });
  }
});

`;

serverContent = serverContent.replace('// API Route for document analysis', newRoutes + '// API Route for document analysis');

fs.writeFileSync('server.ts', serverContent);
