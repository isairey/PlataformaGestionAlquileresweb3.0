const express        = require('express')
const exphbs         = require('express-handlebars')
const db             = require('./db/connection')
const bodyParser     = require('body-parser')
const path           = require('path')
const cookieParser   = require('cookie-parser')
const expressSession = require('express-session')
const RedisStore     = require('connect-redis')(expressSession)
const csrf           = require('csurf')

const {credentials} = require('./config')
const createAuth = require('./auth')

const app           = express()

// handblebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'app',
    helpers: {
        section: function(name, options) {
          if(!this._sections) this._sections = {}
          this._sections[name] = options.fn(this)
          return null
        }
      },
}))
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

  
// Cookie and Session store in Redis Lab
app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: new RedisStore({
      url: credentials.redis.url,
      logErrors: true
  })
}))

//security configuration
const auth = createAuth(app, {
	// baseUrl is optional; it will default to localhost if you omit it;
	// it can be helpful to set this if you're not working on
	// your local machine.  For example, if you were using a staging server,
	// you might set the BASE_URL environment variable to
    // https://staging.meadowlark.com
    baseUrl: process.env.BASE_URL,
    providers: credentials.authProviders,
    successRedirect: '/aplicativo',
    failureRedirect: '/unauthorized',
})

// auth.init() links in Passort middleware:
auth.init()

// now we can specify our auth routes:
auth.registerRoutes()

// csurf Token
app.use(csrf({ cookie: true }))
app.use((req, res, next) => {
    res.locals._csrfToken = req.csrfToken()
    next()
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
    console.log(`Express *Rodando na Porta ${PORT}*`);
});

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// DB
db
.authenticate()
.then(() => {
    console.log('Connection DB Success');
})
.catch(err => {
    console.log("Error DB conection: " + err);
})




// Get UserData
const userData = (req, res, next)=> {

    if( typeof(req.user) == "undefined"){
        var userGaDeco = "visitor"
    } else{
        var userGaDeco = req.user
    }
    return userGaDeco
}
// Pass variable for defaultLayout
app.use((req, res, next) =>{
    app.locals.userGaDeco = userData(req);
    next();
})

// Routes Welcome
app.get('/', (req, res) => {
    res.render("welcomeHome", {layout: 'welcome'});
});
app.get('/about', (req, res) => {
    res.render("welcomeAbout", {layout: 'welcome'});
});


// Routes Accounts
const customerOnly = (req, res, next) => {
    if(req.user && req.user.role === 'user-system') return next()
    // we want custumer-only page to know they need to logon
    res.redirect(303, '/unauthorized')
}

app.get('/aplicativo/account', customerOnly, (req, res) => {
    res.render("account")
})
// page unauthorized
app.get('/unauthorized', (req, res) => {
    res.status(403).render('unauthorized', {layout: 'welcome'})
})
// and a way to logout
app.get('/aplicativo/logout',  customerOnly,(req, res) => {
    req.logout()
    res.redirect('/')
})


// Route Aplicative
app.get('/aplicativo', customerOnly,(req, res) => {
    res.render('home')
})

// Route Article
app.use('/aplicativo/article', customerOnly, require('./routes/articles'));

// Route Event
app.use('/aplicativo/event', customerOnly, require('./routes/events'));

// Router Contract
app.use('/aplicativo/contract', customerOnly, require('./routes/contracts'));

// Gadget Home
// Router Contract
app.use('/aplicativo/gadget', customerOnly, require('./routes/gadgets'));

// Gadget Calendar
// Router Calendar
app.get('/aplicativo/gadget/calendar', customerOnly, (req, res) => {
    res.render("calendar");
});



// ...continue account and system routers
app.use((req, res) => res.render('404', {layout: 'welcome'}))

app.use((err, req, res, next) => {
    console.log(err)
    res.render('500', {layout: 'welcome'})
})