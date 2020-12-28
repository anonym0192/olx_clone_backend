require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const router = require('./src/routes');
const https =  require('https');

const app = express();

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error)=>{

    console.error('ERROR: '+error.message);
})

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(router);

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 7777);
app.listen(app.get('port'),()=>{
    console.log('Server running on port: '+app.get('port'));
});





