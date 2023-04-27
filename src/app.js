const express = require('express');
const setAllRoutes = require('./setters/routeSetters.js')
const cors = require('cors')
require('dotenv').config()
require("./db/models/index.js")
const fileUpload = require('express-fileupload');

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors())

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

setAllRoutes(app)

app.listen(port, () => {
    console.log('Server started on port ' + port);
    console.log(`http://localhost:${port}/api/v1`);
});
