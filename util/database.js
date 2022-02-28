const {connect} = require('mongoose')
const print = require('../util/helpers')


const mongoConnect = async(uri) =>{

    // connection string for mongo atlas
    // const uri = 'mongodb+srv://adminashish:bcEQQlUEEOYQcmo1@shopapp.7cijf.mongodb.net/shopDatabase?retryWrites=true&w=majority'
    
    // connection string for local server of mongoDB
    // const uri = 'mongodb://localhost:27017'
    return connect(uri)    
}



module.exports =  {mongoConnect}
