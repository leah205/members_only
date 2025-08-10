const bcrypt = require("bcryptjs")
const pool = require('../db/pool')



module.exports.selectAnonymousMessages = async () => {
    try{
         const {rows} = await pool.query(`SELECT text FROM messages`)
         console.log(rows)
         return rows
    } catch (err){
        throw new Error(err)
    }
}

module.exports.selectMessages = async () => {
    query = `SELECT messages.text, users.first_name, users.last_name, messages.date_posted
     FROM messages JOIN users 
    ON messages.user_id = users.id
    `
     try{
         const {rows} = await pool.query(query)
       
         return rows
    } catch (err){
        throw new Error(err)
    }
}

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

module.exports.postMessage = async (message, user_id, date) => {
    query = `INSERT INTO messages (text, user_id, date_posted)
    VALUES ($1, $2, $3)`
     try{
         await pool.query(query, [message, user_id, date])
    } catch (err) {
        throw new Error(err)
    }
}

module.exports.makeAdmin = async (id) => {
    try{
        await pool.query("UPDATE users SET is_admin = TRUE WHERE id = $1", [id])
    } catch (err) {
        throw new Error(err)
    }
    
}

module.exports.deleteAdmin = async (id) => {
     try{
        await pool.query("UPDATE users SET is_admin = FALSE WHERE id = $1", [id])
    } catch (err) {
        throw new Error(err)
    }
}

    
   