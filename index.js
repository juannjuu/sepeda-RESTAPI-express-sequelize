const express = require('express')
const app = express()
const router = require('./routes')
const port = 3000

app.use(express.json());

app.use('/api/v1/', router)

app.listen(port, () => {
    console.log("App is running on port ", port)
})