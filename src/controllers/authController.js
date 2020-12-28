const {validationResult, matchedData} = require('express-validator');
const User = require('../models/User');
const State = require('../models/State');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


module.exports = {
   signIn: async (req, res) =>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({
                error: errors.mapped()
            });
        }

        const data = matchedData(req);
        const user = await User.findOne({email: data.email});
        if(!user){
            res.json({
                error: 'Email or Password incorrect!'
            });
            return;
        }
        const match = await bcrypt.compare(data.password, user.passwordHash );
        if(!match){
            res.json({
                error: 'Email or Password incorrect!'
            });
            return;
        }

        const payload = (Date.now()+Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);
        await User.findByIdAndUpdate(user._id,{token: token});

        res.json({token, email: data.email});

    },

    signUp: async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){       
            res.json({
                error: errors.mapped()
            });
        }

        const data = matchedData(req);
  
        const state = await State.findOne({name: data.state});
        if(!state){
            res.json({error: {state: {msg: 'The state doesn\'t exist!'}}});
            return;
        }
        
        const email = await User.findOne({email: data.email});
        if(email){
            res.json({error: {email: {msg: 'E-mail already exists!'}}});
            return;
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        const newUser =  new User({
                            name: data.name,
                            email: data.email,
                            passwordHash,
                            token,
                            state: state._id
                        });
        await newUser.save((err, result)=>{
            if(err){
                res.json({error: {database: {msg: 'There was an error in the user registering, please try again later!'}}});
                return;
            }
            res.json({token});
        });
        
        
    }
}