const express = require('express');
const setAllRoutes = require('./setters/routeSetters.js')
require('dotenv').config();
require("./db/models/index.js")

const port = process.env.PORT;

const app = express();
app.use(express.json());

setAllRoutes(app)

app.get('/' , (req , res) => {
    res.send("hello")
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
    console.log(`http://localhost:${port}`);
});
