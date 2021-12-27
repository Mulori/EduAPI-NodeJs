const { Op } = require('sequelize');
const User = require('../models/User');
var crypto = require('crypto');

module.exports = {
    async UserByEmail(req, res) {       
        const email = req.header('email');
        const password = req.header('password');

        if(!email){
            return res.status(400).json( {error: 'Email not entered' });
        }

        if(!password){
            return res.status(400).json( {error: 'Password not entered' });
        }

        
        var pass = password;
        var hash = crypto.createHash('md5').update(pass).digest('hex');

        const records = await User.findOne({
            attributes: ['id', 'name', 'email', 'created_at'],
            where: {
                email: email,
                password: hash,
            }
        });

        if(!records){
            return res.status(404).json( {error: 'User not found' });
        }
        
        return res.json(records);
    },
};