const  {User, Post} = require('../../models');
const withAuth = require('../../utils/auth');
const router = require('express').Router();

//get all
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// get 1
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
            {exclude: ['password']}
        ]
    })
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'No users at this designated id' });
            return;
        }

        res.json(dbData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// new user
router.post('/', (req, res) => {
    User.create({
        alias: req.body.alias,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbData => {
        req.session.save(() => {
            req.session.user_id = dbData.id;
            req.session.alias = dbData.alias;
            req.session.loggedIn = true;

            res.json(dbData)
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
});


// Login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'No user with that email!' });
            return;
        }

        // Verify user.
        const validatePassword = dbData.checkPassword(req.body.password);
        if (!validatePassword) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = dbData.id;
            req.session.alias = dbData.alias;
            req.session.loggedIn = true;

            res.json({ user: dbData, message: 'You are now logged in!' });
        });
    });
});


// logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();

        });
    } else {
        res.status(404).end();
    }
});


// Edit
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbData => {
        if (!dbData[0]) {
            res.status(400).json({ message: 'error' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});


// Delete
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbData => {
        if (!dbData) {
            res.status(400).json({ message: 'no users under this id' });
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