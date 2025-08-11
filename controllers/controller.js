
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

const validateAdmin = [
    body("admin").equals("true")
]


module.exports.getIndex = async (req, res, next) => {
    try {
        const messages = await db.selectMessages()
       
         res.render('index', {messages: messages})
    } catch(err) {
    
        next(err)
    }
    
   
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
    
    res.render("login", {errors: [{msg: req.flash('error')[0]}]})
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

module.exports.deleteMember = async (req, res, next) => {
    try{
        await db.deleteMember(req.user.id)
     
    } catch(err){
        
        next(err)
    }
   
    res.redirect('/membership')
}

function formatDate(date){
    return date.toISOString().slice(0,19).replace("T", " ")
  
}

module.exports.postMessage = async (req, res, next) => {
    try {
        await db.postMessage(req.body.message, req.user.id,  formatDate(new Date()))
        res.redirect('/')
    } catch (err){
    
        next(err)
    }
}

module.exports.getAdmin = async (req, res, next) => {
    res.render('admin')
}

module.exports.postMakeAdmin = [validateAdmin, async (req, res, next) => {
     const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).render("admin", {
            errors: errors.array()
        })
    }
    try{
         await db.makeAdmin(req.user.id)
    } catch (err) {
       
        next(err)
    }
   
    res.redirect("/admin")
}]

module.exports.postDeleteAdmin = async (req, res, next) => {
    try{
         await db.deleteAdmin(req.user.id)
    } catch (err){
        next(err)
    }
    res.redirect('/admin') 
}

module.exports.deleteMessage = async (req, res, next) => {
    try {
        await db.deleteMessage(req.body.message_id)
    } catch (err){
        next(err)
    }
    res.redirect('/')
}