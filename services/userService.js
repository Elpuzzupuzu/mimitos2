const User = require('../models/User');

exports.getAllUsers = async () => {
    return await User.findAll();
};

exports.createUser = async (data) => {
    return await User.create(data);
};
