import { getDb } from '../../lib/auth/db.js';      //.js extension required for esmodule when calling script from node cli (see package.json scripts)

// Call the getDb function to initialize the database
getDb();

// Ensure the script finishes execution
console.log('Database initialized successfully.');