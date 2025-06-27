import express from 'express';
import App from './src/utils/App.js';




const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

App(app, express);
