let db = require("../models");
let Sequelize = require("sequelize");

module.exports=(app,io)=>{

    //returns all data in database

        io.on('connection', function(socket){
        
        console.log("a user connected")

        socket.on('disconnect', function(){
        
        console.log('user disconnected');
  });
        //request an update to the page when this funtion is called
        socket.on('requestData', function(req,res){
     
            db.treedata.findAll({}).then((results)=>{
                io.emit("sendBackData",results)
       
         })

     
});
})
      
  

    app.delete("/api/deletedata/:id?",(req,res)=>{
        db.treedata.destroy({
            where:{
                id:req.params.id
            }

        }).then((results)=>{
            res.end()
        })
    })

    app.put("/api/dataupdate",(req,res)=>{
        console.log("made it")
        db.treedata.update({
            title:req.body.title,
            min:req.body.min,
            max:req.body.max,
            numArray:req.body.numArray
        },{
            where:{
                id:req.body.id
            }
        }).then((results)=>{
            res.json(results)
        })
    })

        app.post("/api/postdata",(req,res)=>{
            console.log("sending")
            db.treedata.create(req.body).then((results)=>{
                res.json(results)
            })
        })

}