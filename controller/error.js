exports.get404 = (req, res, next)=> {
    res.render('404', {isAuthenticated: req.session.isLoggedIn })
}
exports.get505 = (req, res, next)=> {
    res.render('505', {isAuthenticated: req.session.isLoggedIn })
}