const express = require('express');

const authController = require('./controllers/authController');
const adController = require('./controllers/adController');
const userController = require('./controllers/userController');

const authMiddleware = require('./middlewares/authMiddleware');
const imageMiddleware = require('./middlewares/imageMiddleware');

const authValidator = require('./validators/authValidator');
const userValidator = require('./validators/userValidator');

const router = express.Router();


router.post('/signin', authValidator.signIn, authController.signIn);
router.post('/signup', authValidator.signUp, authController.signUp);

router.get('/categories', userController.getCategories);
router.get('/states', userController.getStates);

router.get('/user/me', authMiddleware.isUserLogged, userController.info);
router.put('/user/me', authMiddleware.isUserLogged, userValidator.editAction, userController.editAction);

router.get('/ads', adController.getAll);
router.get('/ad/item', adController.getOne);
router.post('/ad/add', authMiddleware.isUserLogged , imageMiddleware.uploadImage, adController.add);
router.post('/ad/:id', authMiddleware.isUserLogged, imageMiddleware.uploadImage, adController.editAction);

module.exports = router;