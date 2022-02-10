const router = require('express')()
const multer  = require('multer')
const jwt = require('jsonwebtoken')
const upload = multer({ dest: 'uploads/' })
const dbo = require('./db')
const jwtsecret = 'new-secret'

//auth middleware
router.use(async (req, res, next) => {
    token = req.cookies['token']

    if (!token) {
        //unauthenticated
        
        return res.status(401).end()
    }

    var tokenData
    try {
        tokenData = jwt.verify(token, jwtsecret)
    } catch (err) {
        return res.status(401).end()
    }

    const dbConnect = dbo.getDb()

    //get the user
    var user
    try{
        user = await dbConnect.collection("users").findOne({ username: tokenData.username })
    } catch (err) {
        console.error(`Error getting user ${err}`)
        return res.status(500).end()
    }

    if(!user) {
        console.log(user)
        return res.status(401).end()
    }

    req.user = user
    next()
})


router.get('/', async (req, res) => {
    const dbConnect = dbo.getDb()

    //get the user
    var result
    try{
        result = await dbConnect.collection("videos").findOne({ userId: req.user._id })
    } catch (err) {
        console.error(`Error getting video ${err}`)
        return res.status(500).end()
    }


    if(result){
        return res.status(200).send({
            filename: result.originalname
        })
    }
    return res.status(200).send(null)
})

router.post('/', upload.single('video'), async (req, res) => {
    const dbConnect = dbo.getDb()

    //create video
    const video = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        userId: req.user._id,

    }

    try{
        const result = await dbConnect.collection("videos").insertOne(video) 
        console.log(`Added new video with id ${video.insertedId}`);

    } catch  (err) {
        console.error(`Error inserting video ${err}`)
        return res.status(500).end()
    }
    
    console.log("hello")
    
    res.status(201).send({
        filename: video.originalname,
        userId: req.user._id
    })

})


router.patch('/', async (req, res) => {
    const dbConnect = dbo.getDb()

    var result
    try {
        result = await dbConnect.collection("videos").updateOne({
            userId: req.user._id
        }, {
            $set: { originalname: req.body.filename }
        })
    } catch  (err) {
        console.error(`Error updating video ${err}`)
        return res.status(500).end()
    }

    res.status(200).send(req.body)
    
})

router.delete('/', async (req, res) => {
    const dbConnect = dbo.getDb()

    var result
    try {
        result = await dbConnect.collection("videos").deleteMany({ userId: req.user._id })
    } catch  (err) {
        console.error(`Error updating video ${err}`)
        return res.status(500).end()
    }

    res.end()
    
})

module.exports = router