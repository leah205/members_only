const passport = require('passport');
const pool = require('./db/pool');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs")

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try{
        const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [id])
        const user = rows[0]
        done(null, user)
    } catch(err){
        done(err)
    }
})

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const {rows} = await pool.query("SELECT * FROM users WHERE username = $1", [username])
      const user = rows[0]
      if(!user){
        console.log("incorrect username")
        return done(null, false, {msg: "incorrect username"})
      }
      const match = await bcrypt.compare(password, user.password)
      console.log(password)
      console.log(user.password)
      if(!match){
        console.log("incorrect password")
        return done(null, false, {msg: "incorrect password"})
      }
      console.log("success")
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

module.exports = passport
