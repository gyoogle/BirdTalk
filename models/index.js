const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config, {
    pool: {
      max: 15,
      min: 5,
      idle: 20000
    },
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

//User와 Post는 1:N 관계
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

//Post와 Hashtag는 N:M 관계
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});

//User와 User간 N:M 관계 - 팔로워, 팔로잉
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});

db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

db.User.belongsToMany(db.Post, { through: 'Like'});
db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liker'});

module.exports = db;
