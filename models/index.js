const User = require('./users');
const Post = require('./posts');
const Comments = require('./comments');

// associations.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

User.hasMany(Comments, {
    foreignKey: 'user_id'
})

Post.belongsTo(User, {
    foreignKey: 'user_id'
})
Post.hasMany(Comments, {
    foreignKey: 'post_id'
});

Comments.belongsTo(Post, {
    foreignKey: 'post_id'
});

Comments.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = {User, Post, Comments};