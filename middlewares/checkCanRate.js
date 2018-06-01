const models  = require('../models');

module.exports = (req, res, next) => {
    return models.Rating.findOne({where: {userId: req.session.passport.user, postId: req.body.postId}}) //Check if the post is already rated by rater
        .then(function (rating) {
            return models.Post.findOne({where: {id: req.body.postId, userId: req.session.passport.user}}) //Check if the rater is the post creator
                .then(function (post) {
                    if(rating){
                        return res.status(401).send({ errorType: 3, error: 'User has already rated the post!' })
                    }else if(post){
                        return res.status(401).send({ errorType: 4, error: 'Users cannot rate their own posts!' })
                    }else{
                        return next();
                    }
                });
        });
};