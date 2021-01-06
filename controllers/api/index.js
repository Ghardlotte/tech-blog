const router = require('express').Router();

const userRoutes = require('./users-routes');
const postRoutes = require('./post-routes');
const commentsRoutes = require('./comments-routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentsRoutes);

module.exports = router;