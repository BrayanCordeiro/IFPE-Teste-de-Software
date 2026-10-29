require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nexus API is running on port ${PORT}`);
});