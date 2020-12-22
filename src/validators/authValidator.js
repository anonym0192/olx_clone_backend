const {checkSchema} = require('express-validator');

module.exports = {

    signIn: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            notEmpty: true,
            errorMessage: 'E-mail invalid'
        },
        password: {
            trim: true,
            isLength: {options: {min: 2,max: 13}},
            errorMessage: 'Password must have at least 2 characters'
        }
    }),
    signUp: checkSchema({
        name: {
            trim: true,
            isLength: {options: {min: 2, max: 100}},
            errorMessage: 'Name must have at least 2 characters'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            notEmpty: true,
            errorMessage: 'E-mail invalid'
        },
        password: {
            trim: true,
            isLength: {options: {min: 2,max: 13}},
            errorMessage: 'Password must have at least 2 characters'
        },
        state: {
            notEmpty: true,
            errorMessage: 'State is required!'
        }
    })
}