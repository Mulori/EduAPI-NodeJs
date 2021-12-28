const { Model, DataTypes } = require('sequelize');

class User extends Model{
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            type_account: DataTypes.INTEGER,
        },{
            sequelize
        })
    }

    //Relacionamentos
    // static associate(models){
    //     this.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' } ) //Tem muitos endereços
    //     this.belongsToMany(models.Tech, { foreignKey: 'user_id', through: 'user_techs', as: 'techs' }) //N para N - Pertence a muitos usuarios

    // }
}

module.exports = User;