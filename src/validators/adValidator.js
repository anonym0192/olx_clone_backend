const {checkSchema} = require('express-validator');

module.exports = {
    add: checkSchema({
        title: {
            trim: true,
            isLength: {options: {min: 5, max: 50}},
            errorMessage: 'Title must have between 5 and 50 characters',
            notEmpty: true
        },
        description: {
            trim: true,
            optional: true,
            isLength: {options: {max: 600}},
        },
        price: {
            trim: true,
            isNumeric: true,
            errorMessage: 'price must be a number',
            optional: true
        },
        priceNegotiable: {
            isBoolean: true,
            errorMessage: '',
            optional: true
        },
        active: {
            optional: true
        }
    }),

    editAction: checkSchema({
        title: {
            trim: true,
            isLength: {options: {min: 5, max: 50}},
            errorMessage: 'Title must have between 5 and 50 characters',
            optional: true
        },
        description: {
            trim: true,
            optional: true,
            isLength: {options: {max: 600}},
        },
        price: {
            trim: true,
            isNumeric: true,
            errorMessage: 'price must be a number',
            optional: true
        },
        priceNegotiable: {
            isBoolean: true,
            errorMessage: 'price negotiable must be a boolean',
            optional: true
        },
        active: {
            optional: true
        }
    })
}