const router = require('express')()
const jwt = require('jsonwebtoken')
const dbo = require('./db')

//need to be moved
const jwtsecret = 'new-secret'

//get user by token
router.get('/', async (req, res) => {
    token = req.cookies['token']
    
    if (!token) {
        res.send(null)
        return
    }

    var tokenData
    try {
        tokenData = jwt.verify(token, jwtsecret)
    } catch (err) {
        return res.status(500).end()
    }

    return res.send({ username: tokenData.username })
})

router.post('/signup', async (req, res) => {
    const dbConnect = dbo.getDb()

    //input validation (incomplete; check whitespaces and characters used)
    if(typeof req.body.username !== 'string' || req.body.username.length == 0) {
        return res.status(400).end("Invalid username")
    }
    
    if (req.body.username.length < 3){
        return res.status(400).end("Username must be longer than 3 characters")
    }

    if(typeof req.body.password !== 'string' || req.body.password.length == 0) {
        return res.status(400).end("Invalid password")
    }
    
    if (req.body.password.length < 4){
        return res.status(400).end("Password must be longer than 4 characters")
    }

    //check if user exists
    try{
        if(await dbConnect.collection("users").find({ username: req.body.username }).hasNext()){
            return res.status(409).end("Username is taken") 
        }

    } catch (err) {
        console.error(`Error getting user ${err}`)
        return res.status(500).end()
    }
    
    //create user
    try{
        const result = await dbConnect.collection("users").insertOne({
            username:  req.body.username,
            password: req.body.password
        }) 
        console.log(`Added new user with id ${result.insertedId}`);
        return res.status(201).send();

    } catch  (err) {
        console.error(`Error inserting user ${err}`)
        return res.status(500).end()
    }

})

router.post('/signin', async (req, res) => {
    const dbConnect = dbo.getDb()

    var user
    try {
        user = await dbConnect.collection("users").findOne({ username: req.body.username })

    } catch (err) {
        res.status(500).end()
        return
    }

    if(!user || req.body.password != user.password){
        return res.status(401).end('Username and password don\'t match')
    }
    
    const token = jwt.sign({ 
        username: req.body.username
    }, jwtsecret)
    
    res.cookie('token', token)
    res.end()

})

router.delete('/', async (req, res) => {
    res.clearCookie('token')
    res.end()
})

module.exports = router