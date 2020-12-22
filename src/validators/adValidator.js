const {checkSchema} = require('express-validator');

module.exports = {
    add: checkSchema({
        title: {
            trim: true,
            isLength: {options: {min: 5, max: 50}},
            errorMessage: 'Title must have between 5 and 50 characters',
            notEmpty: true
        },
        descrition: {
            optional: true
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
        images: {
            optional: true
        },
        dateCreated: {
            isDate: true,
            errorMessage: 'dateCreated must be a date',
        },
        active: {
            optional: true
        },
        state: {
            notEmpty: true,
            errorMessage: 'State is required!',
        }
    }),

    editAction: checkSchema({

    })
}