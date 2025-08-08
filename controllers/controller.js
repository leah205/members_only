const bcrypt = require("bcryptjs")
const pool = require('../db/pool')
const {body, validationResult} = require('express-validator')
const passport = require("../passport")


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
        console.log('hello')
        return res.status(400).render("sign-up", {
            errors: errors.array()
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await pool.query( `
            INSERT INTO users(first_name, last_name, username, password) 
            VALUES ($1, $2, $3, $4)
            `, [req.body.first_name, req.body.last_name, req.body.username, hashedPassword])
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
    await pool.query("UPDATE users SET ismember = TRUE WHERE id = $1", [req.user.id])
    res.redirect("/membership")

}]

module.exports.deleteMember = async (req, res) => {
    try{
         await pool.query("UPDATE users SET ismember = FALSE WHERE id = $1", [req.user.id])
    } catch(err){
        console.log(err)
    }
   
    res.redirect('/membership')
}