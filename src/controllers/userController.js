const supabase = require('../config/supaClient.js')

const signUp = async (req, res) => {

    const { name, email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                first_name: name
            }
        }
    })

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(user);
}

module.exports = {
    signUp, 
    login
}; 