const bcrypt = require("bcryptjs")
const pool = require('../db/pool')
const {body, validationResult} = require('express-validator')
//validation

const validateSignup = [
    body("first_name").trim().notEmpty().withMessage('First name is required'),
    body("last_name").trim().notEmpty().withMessage('Last name is required'),
    body("email").trim()
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be a valid email'),
    body("password").trim()
    .isLength({min: 5, max: 20}).withMessage('password must be between 5 and 20 characters'),
    body("password_confirm").trim()
    .custom((value, {req}) => {
        return value == req.body.password
    }).withMessage('Passwords must match')


]



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
            INSERT INTO users(first_name, last_name, email, password) 
            VALUES ($1, $2, $3, $4)
            `, [req.body.first_name, req.body.last_name, req.body.email, hashedPassword])
            res.redirect('/')
    } catch (err) {
        next(err)
    }
}]