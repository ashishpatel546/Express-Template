const fs = require('fs')
const path = require('path')


exports.getIndex = (req, res, next)=>{
    res.render('yourAppView/index')
}