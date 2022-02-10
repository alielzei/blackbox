const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
const dbo = require('./db')
const port = 3001

app.use(cookieParser())
app.use(express.json())

//serve the frontend
app.use(express.static(path.resolve(__dirname, './frontend/build')));

app.use('/api/user', require('./user'))
app.use('/api/video', require('./video'))

// unknown routes go back to the frontend to enable refreshes on the frontend
app.get('/api/*', (req, res) => {
  res.status(404).end()
});

// unknown routes go back to the frontend to enable refreshes on the frontend
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/build', 'index.html'));
});

// perform a database connection when the server starts
dbo.connectToServer(err => {
  if (err) {    
    console.error(err);
    process.exit();
  }

  // start the Express server
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
});

