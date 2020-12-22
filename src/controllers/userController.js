const User = require('../models/User');
const Ad = require('../models/Ad');
const Category = require('../models/Category');
const State = require('../models/State');
const mongoose = require('mongoose');
const utils = require('../utils');

const {validationResult, matchedData} = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = {

    info: async (req, res) =>{

        const token = req.query.token;

        const user = await User.findOne({token});
        const state = await State.findById(user.state);
        const ads = await Ad.find({user: user._id.toString()});
        
        

        const adList = [];

        for(let ad of ads ){
            const category = await Category.findById(ad.category);
            adList.push({...ad._doc, state: state.name ,category: category.slug});
        }

        const data = {
            name: user.name,
            email: user.email,
            state: state.name,
            ads: adList 
        };
        res.json({data});
    },

    editAction: async (req, res) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.json({error: errors.mapped()});
            return;
        }
        const data = matchedData(req);

        const updates = {};

        if(data.email){
            const emailExists = await User.findOne({email: data.email});
            if(emailExists){
                res.json({error: 'Email already exists! Please choose another one'});
                return
            }
            updates.email = data.email;
        }
        if(data.name){
            updates.name = data.name;
        }
        if(data.state){
            if(mongoose.Types.ObjectId.isValid(data.state)){
                const stateExists = await State.findById(data.state);
                if(!stateExists){
                    res.json({error: 'The state code is not invalid'});
                    return;
                }
                updates.state = data.state;
            }else{
                res.json({error: 'The state id is not invalid'});
                return;
            }
        }
        if(data.password){
            const passwordHash = (await bcrypt.hash(data.password, 10)).toString();
            updates.passwordHash = passwordHash;
        }
        
        const newUser = await User.findOneAndUpdate({token: data.token}, {$set: updates});
        await newUser.save((err, result)=>{
            if(err){
                res.json({error: 'There was a problem in the user update, please try again later.'});
                return;
            }
            res.json({data: result.token});
        });
    },

    getCategories: async (req, res) =>{
        const categories = await Category.find();

        const data = [];
        for(let cat of categories){
             
            const icon = utils.getIconsFullpath(cat.slug);
            data.push({id: cat._id ,name: cat.name, slug: cat.slug, icon});
        }
        res.json({data});
    },

    getStates: async (req, res) =>{
        const states = await State.find();

        const data = [];
        for(let state of states){
            data.push({id: state._id ,name: state.name});
        }
        res.json({data});
    }
    
}