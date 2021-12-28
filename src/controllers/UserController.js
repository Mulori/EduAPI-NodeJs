const { Op } = require('sequelize');
const User = require('../models/User');
const Token = require('../models/Token');
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
            attributes: ['id', 'name', 'email', 'type_account', 'created_at'],
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

    async CreateUser(req, res){
        var token_ = req.header('x-access-token');
        const { name, email, password, type_account } = req.body;

        return res.json({ token: 'ola '+ token_});

        const token = await Token.findOne({
            attributes: ['token'],
            where: {
                token: token_,
            }
        });

        if(!token){
            return res.status(401).json( {error: 'Token is not valid' });
        }

        if(!name){
            return res.status(400).json( {error: 'Name not entered' });
        }

        if(!email){
            return res.status(400).json( {error: 'Email not entered' });
        }

        if(!password){
            return res.status(400).json( {error: 'Password not entered' });
        }

        if(!type_account){
            return res.status(400).json( {error: 'Type account not entered' });
        }

        var pass = password;
        var hash = crypto.createHash('md5').update(pass).digest('hex');

        const user = await User.create({ name, email, hash, type_account });

        return res.json(user);
    },
};