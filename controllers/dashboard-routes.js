const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comments} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'created_at']
    })
    .then(dbData => {
        const posts = dbData.map(post => post.get({ plain: true }));
        res.render('dashboard', {posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'post_text', 'created_at'],
        include: [
            {
                model: Comments,
                attributes: ['comment_text', 'created_at'],
                include: {
                    model: User,
                    attributes: ['alias']
                }
            }
        ]
    })
    .then(dbData => {

        const post = dbData.get({ plain: true });
        res.render( 'editpost', { post, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.get('/newpost', withAuth, (req, res) => {
    res.render('new-post', { loggedIn: req.session.loggedIn });
})


module.exports = router;