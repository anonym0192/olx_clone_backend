const {checkSchema} = require('express-validator');

module.exports = {
    editAction: checkSchema({
            token: {
                notEmpty: true 
            },
            name: {
                trim: true,
                isLength: {options: {min: 2, max: 100}},
                errorMessage: 'Name must have at least 2 characters',
                optional: true
            },
            email: {
                isEmail: true,
                normalizeEmail: true,
                notEmpty: true,
                errorMessage: 'E-mail invalid',
                optional: true
            },
            password: {
                trim: true,
                isLength: {options: {min: 2,max: 13}},
                errorMessage: 'Password must have at least 2 characters',
                optional: true
            },
            state: {
                notEmpty: true,
                errorMessage: 'State is required!',
                optional: true
            }})
}