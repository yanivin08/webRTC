const express = require('express');
const router = express.Router();
const { checkAuthenticate } = require('../config/chatauth');

router.get('/:id',checkAuthenticate, (req,res) => {
    if(req.user !== undefined){
        res.render('chat.ejs',{
            name: req.user.name
        });
    }else{
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        if(fullUrl.indexOf('username') == -1){
            res.render('user.ejs',{
                id: req.params.id
            })
        }else{
            res.render('chat.ejs',{
                name: fullUrl.substring(fullUrl.indexOf('=') + 1).replace('+'," ")
            })
        }
    }
});

module.exports = router;