const bcrypt = require("bcryptjs")
const pool = require('../db/pool')

module.exports.signUp =  async ({first_name,last_name, username, password}) => {
    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query( `
            INSERT INTO users(first_name, last_name, username, password) 
            VALUES ($1, $2, $3, $4)
            `, [first_name, last_name, username, hashedPassword])
    } catch (err) {
        throw new Error(err)
    }
        
}
module.exports.makeMember = async (id) => {
    try{
        await pool.query("UPDATE users SET ismember = TRUE WHERE id = $1", [id])
    } catch (err) {
        throw new Error(err)
    }
    
}
module.exports.deleteMember = async (id) => {
    try{
         await pool.query("UPDATE users SET ismember = FALSE WHERE id = $1", [id])
    } catch (err) {
        throw new Error(err)
    }
    
}

    
   