const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comments} = require('../models');

router.get('/', (req, res) => {
    console.log(req.session)
    Post.findAll({
        attributes: ['id', 'title', 'post_text', 'created_at'],
        include: [
            {
                model: User, 
                attributes: ['alias']
            }
        ]
    })
    .then(dbData => {
        const posts = dbData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        attributes: ['id', 'title', 'post_text', 'created_at'],
        where: {
            id: req.params.id
        },
        include: [
            {
                model: User,
                attributes: ['alias']
            },
            {
                model: Comments,
                attributes: ['id', 'comment_text', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['alias']
                }
            }
        ]
    })
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'no post under this id' });
            return;
        }

        const post = dbData.get({ plain: true });

        res.render('single-post', {post: post, loggedIn: req.session.loggedIn})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login')
});

router.get('/signup', (req, res) => res.render('signup'));

module.exports = router;