const Ad = require('../models/Ad');
const User = require('../models/User');
const Category = require('../models/Category');
const State = require('../models/State');
const mongoose = require('mongoose');
const utils = require('../utils');

module.exports = {

    getAll: async (req, res) =>{

        const ads = await Ad.find();
        const adList = [];

        for(let ad of ads){
            
            let user = '';
            let state = '';
            let category = '';

            try{
             user =  await User.findById(ad.user);
             state = await State.findById(ad.state);
             category = await Category.findById(ad.category);
            }catch(error){
                console.error(error.message);
            }

            const images = utils.getImagesFullpath(ad.images);
            adList.push({
                    id: ad.id,
                    title: ad.title,
                    name: ad.name,
                    price: ad.price,
                    priceNegotiable: ad.priceNegotiable,
                    views: ad.views,
                    images,
                    dateCreated: ad.dateCreated,
                    category: category?.slug,
                    active: ad.active,
                    user: user?.email, 
                    state: state?.name
                });
        }
        res.json({data: adList});
    },

    getOne: async (req, res) =>{

        if(!req.query.id){
            res.json({error: 'The ad id was not informed'});
            return;
        }

        if(!mongoose.Types.ObjectId.isValid(req.query.id)){
            res.json({error: 'The id is invalid'});
            return;
        }

        const ad = await Ad.findById(req.query.id);
        if(!ad){
            res.json({error: 'Ad did not exist!'});
            return;
        }

        const user = await User.findById(ad.user);
        const state = await State.findById(ad.state);
        const category = await Category.findById(ad.category);

        const images = utils.getImagesFullpath(ad.images);
        
        const data = {
            id :ad._id,
            title: ad.title,
            description: ad.description,
            price: ad.price,
            views: ad.views,
            priceNegotiable: ad.priceNegotiable,
            images,
            dateCreated: ad.dateCreated,
            active: ad.active,
            category: category?.name,
            state: state?.name,
            user: user?.email


        };
        
        if(mongoose.Types.ObjectId.isValid(ad.user)){
            const user = await User.findById(ad.user);
            if(user){
                data.user = {name: user.name, email: user.email}; 
            }
        }
        if(mongoose.Types.ObjectId.isValid(ad.category)){
            const category = await Category.findById(ad.category);
            if(category){
                data.category = {name: category.name, slug: category.slug};
            }
        }
        if(mongoose.Types.ObjectId.isValid(ad.state)){
            const state = await State.findById(ad.state);
            if(state){
                data.state = state.name;
            }
        }
        res.json({data});
    },

    add: async (req, res) =>{

        const token = req.body.token;

        const user = await User.findOne({token});
          
        const category = await Category.findById(req.body.category);
        if(!category){
            res.json({error: 'Selected category did not exist!'});
            return;
        }

       const newAd = new Ad({
                    name: req.body.name,
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    priceNegotiable: req.body.priceNegotiable || false,
                    images: req.body.images,
                    dateCreated: Date.now(),
                    views: 0,
                    category: req.body.category,
                    state: user.state,
                    user: user._id
                });

        await newAd.save((err, result)=>{

                if(err){
                    console.error(err.message);
                    res.json({error: 'There was an error in the ad creation, please try again later'});
                    return;
                }
                
                res.json({data: {id: result._id}});
            });

    },

    editAction: async (req, res) =>{

        if(!mongoose.Types.ObjectId.isValid(req.body.ad)){
            res.json({error: 'Ad id is not valid!'});
            return;
        }
        const user = await User.findOne({token: req.body.token});
        const userId = user._id.toString();
   
        const ad = await Ad.findById(req.body.ad);
    
        if(!ad || (userId !== ad.user)){
            res.json({error: 'Ad id is not valid!'});
            return;
        }
        const updates = {};

        if(req.body.name){
            updates.name = req.body.name;
        }
        if(req.body.title){
            updates.title = req.body.title;
        }
        if(req.body.description){
            updates.description = req.body.description;
        }
        if(req.body.price){
            updates.price = req.body.price;
        }
        if(req.body.priceNegotiable){
            updates.priceNegotiable = req.body.priceNegotiable;
        }
        if(req.body.images){
            updates.images = req.body.images;
        }

        if(req.body.category){     
            const category = await Category.findById(req.body.category);
            if(!category){
                res.json({error: 'Category is not valid!'});
                return;
            }
            updates.category = req.body.category;
        }

        if(req.body.state){    
            const state = await State.findById(req.body.category);
            if(!state){
                res.json({error: 'State is not valid!'});
                return;
            }
            updates.state = req.body.state;        
        }

        const newAd = await Ad.findByIdAndUpdate(req.body.ad, {$set: updates});
        await newAd.save((err, result)=>{
            if(err){
                console.error(err.message);
                res.json({error: 'There was an error in the ad update, please try again later'});
                return;
            }       
            res.json({data: result});
        });

        
    }
}