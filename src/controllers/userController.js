const bcrypt = require('bcrypt'); 
const {db} = require('../models'); 
const jwt = require("jsonwebtoken");

const User = db.users;

const signUp = async (req, res) => {
    try {
        if (res.headersSent) { // <--- ADD THIS CHECK
            console.log("fucking cibai knn"); 
            console.warn("SIGNUP: Headers already sent, skipping response in controller.");
            return; // Exit early if response was already sent
        }

        const {userName, email, password} = req.body; 

        console.log("SIGNUP: Received password (plain text):", password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("SIGNUP: Generated hashed password:", hashedPassword);

        const data = {
            userName, 
            email, 
            password: hashedPassword
        }; 
        const user = await User.create(data);

        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.SECRETKEY, {
                expiresIn: 86400,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            console.log("user", JSON.stringify(user, null, 2));
            console.log(token);
            //send users details
            return res.status(201).send(user);
        } else {
            return res.status(409).send("Details are not correct");
        }
        
    } catch (error) {
        if (res.headersSent) { // <--- ADD THIS CHECK
            console.warn("SIGNUP: Headers already sent, skipping response in controller.");
            return; // Exit early if response was already sent
        }

        console.log(error);

    }
        
}; 

const login = async (req, res) => {
    try {
        const {email, password} = req.body; 

        const  user  = await User.findOne({ where: { email } });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);
            
            if(isSame) {
                let token = jwt.sign({ id: user.id }, process.env.SECRETKEY, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches with the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                console.log("login successful"); 
                //send user data
                return res.status(201).send(user);   
            } else {
                return res.status(401).send("Authentication failed");
            }
             
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch (error) {
        console.log(error);
    }

}; 

module.exports = {
    signUp, 
    login
}; 

