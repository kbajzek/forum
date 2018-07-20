const models  = require('../models');

module.exports = (req, res, next) => {
    return models.MessageMember.findOne({where: {id: req.body.memberId}}) //Check if the message member exists
        .then(function (member) {
            return models.MessageMember.findOne({where: {UserId: req.session.passport.user, MessageId: member.MessageId}}) //Check if the user is a member of the message
                .then(function (member2) {
                    if(!member){
                        return res.status(401).send({ errorType: 3, error: 'Message member does not exist!' })
                    }else if(!member2){
                        return res.status(401).send({ errorType: 4, error: 'You are not a member of the message!' })
                    }else if(member.permission === 2 || member2.permission !== 2){
                        return res.status(401).send({ errorType: 5, error: 'You do not have the required permission to remove this member!' })
                    }else if(member.userId === req.session.passport.user){
                        return res.status(401).send({ errorType: 6, error: 'You cant remove yourself from a conversation!' })
                    }else{
                        return next();
                    }
                });
        });
};