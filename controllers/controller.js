
const {body, validationResult} = require('express-validator')
const passport = require("../passport")
const db = require('../db/queries')


//validation


const validateSignup = [
    body("first_name").trim().notEmpty().withMessage('First name is required'),
    body("last_name").trim().notEmpty().withMessage('Last name is required'),
    body("username").trim()
    .notEmpty().withMessage('username is required'),
    body("password").trim()
    .isLength({min: 5, max: 20}).withMessage('password must be between 5 and 20 characters'),
    body("password_confirm").trim()
    .custom((value, {req}) => {
        return value == req.body.password
    }).withMessage('Passwords must match')
]

const validatePasscode = [
    body("passcode").trim()
    .equals("abc")
]


module.exports.getIndex = (req, res) => {
    res.render('index')
}
module.exports.getSignUp = (req, res) => {
    res.render('sign-up')
}
//add validation
module.exports.postSignUp = [validateSignup, async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
     
        return res.status(400).render("sign-up", {
            errors: errors.array()
        })
    }
    try {
        await db.signUp(req.body)
        res.redirect('/login')
    } catch (err) {
        next(err)
    }
}]

module.exports.getLogin = (req, res) => {
    console.log(req.flash('error'))
    res.render("login")
}

module.exports.postLogin = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
})

module.exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err){
            return next(err)
        }
        res.redirect("/")
    })
}

module.exports.isAuth = async (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports.getMembership = (req, res) => {
    res.render('membership')
}



module.exports.postMakeMember = [validatePasscode, async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).render("membership", {
            errors: errors.array()
        })
    }
    await db.makeMember(req.user.id)
    
    res.redirect("/membership")

}]

module.exports.deleteMember = async (req, res) => {
    try{
        await db.deleteMember(req.user.id)
     
    } catch(err){
        console.error(err)
    }
   
    res.redirect('/membership')
}

function formatDate(date){
    return date.toISOString().slice(0,19).replace("T", " ")
  
}

module.exports.postMessage = async (req, res) => {
    try {
        await db.postMessage(req.body.message, req.user.id,  formatDate(new Date()))
        res.redirect('/')
    } catch (err){
        console.error(err)
    }
}