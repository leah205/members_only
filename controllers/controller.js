const bcrypt = require("bcryptjs")
const pool = require('../db/pool')
const {body, validationResult} = require('express-validator')
const passport = require("../authenticate")

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