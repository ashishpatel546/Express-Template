const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const print = require('./util/helpers')
const {mongoConnect} = require('./util/database')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')

const appRoutes = require('./routes/appRoute')
const errorController = require('./controller/error');


const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@shopapp.7cijf.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`

const port = process.env.PORT || 3000


const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))

const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    // expires: 10*60*1000   // 10min
})

const csrfProtection = csrf()
const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/images')
    },
    filename: (req, file, cb)=>{
        const uploadedName = Date.now().toString() + '-' + file.originalname
        cb(null, uploadedName)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') cb(null, true)
    else cb(null, false)
}

app.set("view engine", 'ejs')

app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))

//to use bodyparser url data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use(session({secret: 'my sectet', resave: false, saveUninitialized: false, store: store})); //store option that is defined constant already

//CSRF protection

app.use(csrfProtection)

//setting flash message setting using middleware
app.use(flash())

app.use((req, res, next)=>{

    if(!req.session.user){
        return next()
    }

    User.findById(req.session.user._id)
    .then(user=>{
        req.user = user;
        next()
    })
    .catch(err=>print(err))
})



//seting res.locals to pass every response rendering

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken()
    next()
})


//*********************DEFINE THE ROUTES********* */
// app.use('/admin', adminRoutes)
// app.use(shopRoutes)
// app.use(authRoutes)
app.use(appRoutes)
app.get('/error', errorController.get505)
app.use(errorController.get404)
app.use((err, req, res, next) =>{
    res.redirect('/error')
})

mongoConnect(MONGODB_URI).then(conn=>{
    print('Database Connected Successfully')
    app.listen(port)    
})
.catch(err=> print(err))