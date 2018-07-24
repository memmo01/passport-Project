let express =require("express");
let app= express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser=require('body-parser');
let db= require("./models");


let PORT = process.envNODE_ENV||3000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("./public"));

require("./routes/api-routes.js")(app,io);
require("./routes/html-routes.js")(app)

db.sequelize.sync().then(function(){
    http.listen(PORT,()=>{console.log(`Listening on port ${PORT}`)
});
});