const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

const db = require('./models/User')
//const {credentials} = require('./config')

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
    db.getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
})

module.exports = (app, options) => {

    // if success and failure redirects aren't specified,
	// set some reasonable defaults
    if(!options.successRedirect)
        options.successRedirect = '/aplicativo'
    if(!options.failureRedirect)
        options.failureRedirect  = '/aplicativo/login'

    return {
        init: function(){
            const config = options.providers
            // configure Facebook strategy
            passport.use(new FacebookStrategy({
                clientID: "1788007428039766",
                clientSecret: "ee5f782f0e869610471166a4a26ddd60",
                callbackURL: (options.baseURL || '') + '/auth/facebook/callback',
            }, (accessToken, refreshToken, profile, done) => {
                const authId = 'facebook: ' + profile.id
                db.getUserByAuthId(authId)
                .then(user => {
                    if(user) return done(null, user)
                    db.addUser({
                        authId: authId,
                        name: profile.displayName,
                        role: 'user-system'
                    })
                    .then(user => {done(null, user)})
                    .catch(err => done(err, null))
                })
                .catch(err => {
                    console.log('whoops, there was an error: ', err.message)
                    if(err) return done(err, null)
                })
            }))

            app.use(passport.initialize())
            app.use(passport.session())
        },
        registerRoutes: () => {
            //register facebook routes
            app.get('/auth/facebook', (req, res, next) => {
                if(req.query.redirect) req.session.authRedirect = req.query.redirect
                passport.authenticate('facebook')(req, res, next)
            })
            app.get('/auth/facebook/callback', passport.authenticate('facebook',
            { failureRedirect: options.failureRedirect }),
            (req, res) => {
                console.log('sucessful /auth/facebook/callback')
                // we only get here on successful authentication
                const redirect = req.session.authRedirect
                if(redirect) delete req.session.authRedirect
                console.log(`redirecting to ${redirect || options.successRedirect}${redirect ? '' : ' (fallback)'}`)
                res.redirect(303, redirect || options.successRedirect)
            })
        }
    }


}