const express = require('express');
const userControllers = require('../controllers/userController.js');
const {login, signUp} = userControllers; 
const router = express.Router(); 

router.post('/signup', signUp); 
router.post('/login', login); 

module.exports = router;