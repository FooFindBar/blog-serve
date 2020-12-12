//Sequelize,和md5加密
const md5 = require('blueimp-md5')
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize('blog', 'root', 'sw000519', {
    host: 'localhost',
    dialect: 'mysql'
});
const Blog = sequelize.define("blog", {
    name: DataTypes.TEXT,
    favoriteColor: {
        type: DataTypes.TEXT,
        defaultValue: 'green'
    },
    age: DataTypes.INTEGER,
    cash: DataTypes.INTEGER
});


