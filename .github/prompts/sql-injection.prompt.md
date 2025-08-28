# SQL Injection Vulnerability Demo

This prompt demonstrates how to introduce a SQL injection vulnerability into the Product API for demonstration purposes. **WARNING: This creates an intentional security vulnerability that should NEVER be used in production code.**

## Overview

The current Product API implementation uses a secure repository pattern with parameterized queries that prevent SQL injection. To demonstrate a vulnerability, we'll create an alternative implementation that directly concatenates user input into SQL queries.

### New Branch

First create a new branch for the vulnerable implementation:

```bash
git checkout -b sql-injection-demo
```

### Create a Vulnerable Route Handler

Add a new route handler that bypasses the secure repository layer and executes raw SQL with user input:

```typescript
// Add this to api/src/routes/product.ts

// VULNERABLE: SQL Injection endpoint for demo purposes
router.get('/search/vulnerable', async (req, res, next) => {
  try {
    const searchTerm = req.query.q as string;
    
    // VULNERABLE: Direct SQL execution with string concatenation
    const db = await getDatabase();
    const sql = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%'`;
    
    const products = await db.all(sql);
    res.json(products);
  } catch (error) {
    next(error);
  }
});
```

**This vulnerability is for educational purposes only. Never deploy code with SQL injection vulnerabilities to production.**

### Push and Create a PR

```bash
git add .
git commit -m "Add SQL injection vulnerability for demo"
git push origin sql-injection-demo
```

Then, create a pull request (PR) from the `sql-injection-demo` branch to the main branch in the GitHub repository.