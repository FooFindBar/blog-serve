
// 引入数据库连接相关模块
const { Sequelize, DataTypes } = require("sequelize");
//引入时间日期格式化字符串
var moment = require('moment');
let {password,username,ip,dbname}=require('../config');
const { log } = require("debug");
// 进行数据库连接
const sequelize = new Sequelize(dbname, username, password, {
    host: ip,
    dialect: 'mysql'
});
// 测试连接是否成功
sequelize
    .authenticate()
    .then(() => {
        
    })
    .catch(err => {
        
    })

// var current_time = moment(Date.now()).format('YYYY-MM-DD')

const Blog = sequelize.define("tb_blogs",
    {
        blogID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        context: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createDate: {
            type: DataTypes.STRING,
            defaultValue: moment(Date.now()).format('YYYY-MM-DD').toString()
        },
        witch: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
    timestamps: false
}
);

const TagType = sequelize.define("tb_tagtypes", {
    tagTypeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tagName: {
        type: DataTypes.STRING,
    },
}, { timestamps: false });


TagType.belongsToMany(Blog, { through: 'tb_tags',as: 'Blogs' });
Blog.belongsToMany(TagType, { through: 'tb_tags',as: 'Tags' });

const Sentence = sequelize.define("tb_sentences", {
    sentenceID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sentenceName: {
        type: DataTypes.STRING,
    },
    sentenceContext: {
        type: DataTypes.TEXT,
    },
}, { timestamps: false });


const Admin = sequelize.define("tb_admin", {
    adminID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
}, { timestamps: false });

//强制同步模型
(async () => {
    await sequelize.sync({ force: false });
    console.log('模型同步成功。。。');
})()

module.exports = { Blog, TagType,Sentence,Admin }

