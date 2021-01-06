const  { Comments, User } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// get all comments
router.get('/', (req, res) => {
    Comments.findAll({
        include: [
            {
                model: User,
                attributes: ['alias']
            }
        ]
    })
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comments.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

router.delete('/:id', withAuth, (req, res) => {
    Comments.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'no comment under this id '});
            return;
        }
        res.json(dbData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;