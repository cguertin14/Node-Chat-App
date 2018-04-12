import path from 'path';
import express from 'express';

// Public path.
const publicPath = path.join(__dirname, '../public')
// Application (express).
const app = express();
// Port of the server.
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port, () => console.log(`Server listening on port ${port}`));
