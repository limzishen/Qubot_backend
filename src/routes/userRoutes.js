const express = require('express');
const userControllers = require('../controllers/userController.js');
const {login, signUp} = userControllers; 
const userAuth = require('../middlewares/userAuth.js');


const router = express.Router(); 

router.post('/signup', userAuth.saveUser, signUp); 
router.post('/login', login); 

module.exports = router;