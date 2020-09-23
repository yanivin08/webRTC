module.exports = {
    checkAuthenticate: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }

        if(req.originalUrl == '/dashboard/session'){
            req.flash('error_msg','Please log in to view this resource');
            res.redirect('../users/login');
        }else{
            return next();
        }

    }
}