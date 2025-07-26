const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors'); 
const supabase = require('./src/config/supaClient.js')
const stockRoutes = require('./src/routes/stockRoutes.js')
const deepseekRoutes = require('./src/routes/deepseekRoutes.js')
const finNewsRoutes = require('./src/routes/finNewsRoutes.js')
const messagesRoute = require('./src/routes/messagesRoute.js')


const PORT = process.env.PORT || 4000
const app = express();
const corsOptions = {
    credentials: true,
    origin: [ 'http://localhost:8080', 'https://qubot-frontend.vercel.app/'] // Whitelist the domains you want to allow
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/stocks', stockRoutes);
app.use('/api/deepseek', deepseekRoutes); 
app.use('/api/news', finNewsRoutes);
app.use('/api/messages', messagesRoute); 

app.use((req, res, next) => {
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  next();
});

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`)); 
