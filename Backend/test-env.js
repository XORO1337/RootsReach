const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log("✅ ENV Loaded:", process.env.MONGO_URI);
