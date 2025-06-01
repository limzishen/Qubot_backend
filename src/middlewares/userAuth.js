const express = require('express'); 
const {db} = require("../models");

const User = db.users;

const saveUser = async (req, res, next) => {
    try {
        const username = await User.findOne({
            where: {
                userName: req.body.userName,
            },
        });

        //if username exist in the database respond with a status of 409
        if (username) {
            return res.status(409).json({ message: "username already taken" });
        }

            //checking if email already exist
        const emailcheck = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        //if email exist in the database respond with a status of 409
        if (emailcheck) {
            return res.status(409).json({ message: "email already taken" });
        }

        next();

    } catch (error) {
        console.log(error);
    }
}; 


module.exports = {
    saveUser,
};
