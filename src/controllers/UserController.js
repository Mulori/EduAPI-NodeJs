const { Op } = require('sequelize');
const User = require('../models/User');
const Token = require('../models/Token');
var crypto = require('crypto');
const { md5 } = require('pg/lib/utils');

//Metodo para autenticação do token
async function AuthToken(token){

    const token_auth = await Token.findOne({
        attributes: ['token'],
        where: {
            token: token,
        }
    });

    if(!token_auth){
        return false;
    }

    return true;
}

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

        const access_token = req.header('token');
        const { user_name, user_email, user_password, user_type_account } = req.body;

        //Chama função de autenticação do token
        const auth = await AuthToken(access_token);      
        if(!auth){
            return res.status(401).json( {error: 'Token is not valid' });
        }    
        
        if(!user_name){
            return res.status(400).json( {error: 'Name not entered' });
        }

        if(!user_email){
            return res.status(400).json( {error: 'Email not entered' });
        }

        if(!user_password){
            return res.status(400).json( {error: 'Password not entered' });
        }

        if(!user_type_account){
            return res.status(400).json( {error: 'Type account not entered' });
        }

        const name = user_name;
        const email = user_email;
        const type_account = user_type_account;
        const password = crypto.createHash('md5').update(user_password).digest("hex");
        
        const user = await User.create({ name, email, password, type_account });

        return res.json(user);
    },
};