const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/createuser', userController.createUser);

module.exports = router;
