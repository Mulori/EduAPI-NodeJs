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

//Metodo para autenticação do email
async function ExistEmail(email){
    const email_exist = await User.findOne({
        attributes: ['email'],
        where: {
            email: email,
        }
    });

    if(email_exist){
        return true;
    }

    return false;
}

//Função para validar email
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

async function ExistUser(email, senha){
    const retorno = await User.findOne({
        attributes: ['name', 'email', 'created_at'],
        where: {
            email: email,
            password: senha
        }
    });

    if(retorno){
        return true;
    }
    else{
        return false;
    }
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
            return res.status(400).json( {error: 'Name not entered', correction: 'Enter the name - user_name' });
        }

        if(!user_email){
            return res.status(400).json( {error: 'Email not entered', correction: 'Enter the email - user_email' });
        }

        //Chama função de autenticação do email
        const exist_email = await ExistEmail(user_email);      
        if(exist_email){
            return res.status(401).json( {error: 'The email you entered already exists, try again' });
        }  

        //Chama função para verificar se o email digitado é valido
        const valid_email = validateEmail(user_email);      
        if(!valid_email){
            return res.status(401).json( {error: 'The email entered is not valid, try again' });
        }        

        if(!user_password){
            return res.status(400).json( {error: 'Password not entered', correction: 'Enter the password - user_password' });
        }

        if(!user_type_account){
            return res.status(400).json( {error: 'Type account not entered', correction: 'Enter the account type - user_type_account' });
        }

        if(user_type_account < 1 || user_type_account > 2){
            return res.status(400).json( {error: 'Type account not found', correction: 'Try again with 1 or 2' });
        }

        const name = user_name;
        const email = user_email;
        const type_account = user_type_account;
        const password = crypto.createHash('md5').update(user_password).digest("hex");

        const user = await User.create({ name, email, password, type_account });

        return res.json(user);
    },

    async Login(req, res){
        const token  = req.header('token');
        const email  = req.header('email');
        const password  = req.header('password');

        //Converte a senha enviada para md5 e assim poder verificar no banco        
        const pass = crypto.createHash('md5').update(password).digest("hex");

        const user_account = await ExistUser(email, pass);
        if(!user_account){
            return res.status(404).json( { error: 'Credentials not found', correction: 'Check email or password' });
        }
        else{
            return res.status(200).json( { Status: 'Authenticated' } );
        }        
    }
};