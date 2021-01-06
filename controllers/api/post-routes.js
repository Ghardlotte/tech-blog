const  { User, Post, Comments } = require('../../models');
const withAuth = require('../../utils/auth');
const router = require('express').Router();

// find all
router.get('/', (req, res) => {
    Post.findAll()
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// find one by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
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
        if (!dbData) {
            res.status(400).json({ message: 'no posts with this id.'});
            return;
        }

        res.json(dbData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


// add a post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    })
    .then(dbData => res.json(dbData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// update a post.
router.put('/:id', withAuth, (req, res) => {
    Post.update(
    {
        title: req.body.title,
        post_text: req.body.post_text
    },
    {
        where: {
            id: req.params.id
        }
    }
    )
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'no post under this id to edit' });
            return;
        }

        res.json(dbData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// Delete Post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'No post to delete under id' })
            return;
        }

        res.json(dbData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;