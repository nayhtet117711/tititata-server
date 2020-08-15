const app = require('express')();
const socketJsonParser = require('socket.io-json-parser');
const server = require('http').createServer(app);
const expressFileUpload = require('express-fileupload');
const path = require("path")
const socketServerOptions = {
    path: "/tititata-socket",
    parser: socketJsonParser
}
const io = require('socket.io')(server, socketServerOptions);

const port = 3003

app.use(expressFileUpload())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const { v4 } = require('uuid')

const rootDirectory = path.dirname(require.main.filename)

const imageUploadDirectory = "uploads"

app.use((req, res, next) => {
    // console.log(`Pid: ${process.pid}`)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, *POST*, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/asset/images/:fileName", (req, res, next) => {
    try {
        const fileName = req.params.fileName
        const file = `${rootDirectory}/${imageUploadDirectory}/${fileName}`;
        return res.download(file);
    } catch (error) {
        return res.json({ success: false,  payload: null, error: "Error: " + error })
    }
})

app.post("/asset/images", (req, res, next) => {
    console.log("hi there")
    try {
        const imageFile = req.files.imageFile
        const newFileName = v4()
        const extension = imageFile.mimetype.split("/")[1]
        // console.log("file: ", imageFile.mimetype.split("/"), "\n v4: ", v4(), "\nrootDirectory: ", rootDirectory)
        return imageFile.mv(`${rootDirectory}/${imageUploadDirectory}/${newFileName}.${extension}`, error => {
            if (error) return res.json({ success: false,  payload: null, error: "Error: "+ error})
            return res.json({ success: true, payload: `/asset/images/${newFileName}.${extension}` })
        })
    } catch (error) {
        return res.json({ success: false,   payload: null, error: "Error: " + error })
    }
})

server.listen(port, () => {
    console.log(`TitiTata server listening at http://localhost:${port}`)

    module.exports.socketIo = io

    require("./controllers/socket.controller")
})

