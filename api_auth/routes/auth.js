const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//VALIDATION
const joi = require('@hapi/joi');


const schemaRegister = joi.object({

    name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required()
});

const schemaLogin = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required()
});

router.post('/register', async (req, res) => {

    //VALIDATION BEFORE CREATING
    try {
        const validate = await schemaRegister.validateAsync(req.body);
    }
    catch (err) { 
        return res.status(400).send(err.details[0].message)
    }

    //CHECKING IF THE EMAIL ALREADY TAKEN
    const checkEmail = await User.findOne({email: req.body.email})
    if(checkEmail) return res.status(400).send('This email already taken.');     
    
    //HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    //CREATE NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPass
    });

    try{
        const savedUser = await user.save();

	//CREATE AND ASSING A TOKEN
    	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.send({token: token});
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //VALIDATE DATA COMING FROM CLIENTS
    try {
        const validate = await schemaLogin.validateAsync(req.body);
    }
    catch (err) { 
        return res.status(400).send(err.details[0].message)
    }

    //CHECKING IF THE EMAIL IS VALID
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email or password is wrong.');

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password , user.password);
    if(!validPass) return res.status(400).send('Email or password is wrong.');
    
    //CREATE AND ASSING A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token: token});
});


module.exports = router;
