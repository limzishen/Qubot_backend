const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors'); 
const userRoutes = require('./src/routes/userRoutes')
const supabase = require('./src/config/supaClient.js')
const stockRoutes = require('./src/routes/stockRoutes.js')
const deepseekRoutes = require('./src/routes/deepseekRoutes.js')

const PORT = process.env.PORT || 4000
const app = express();
const corsOptions = {
    credentials: true,
    origin: [ 'http://localhost:8080', 'https://qubot-frontend.vercel.app' ] // Whitelist the domains you want to allow
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes for the user API
app.get('/user', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json(data);
});

app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/deepseek', deepseekRoutes); 

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`)); 

