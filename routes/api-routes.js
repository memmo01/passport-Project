let db = require("../models");
let Sequelize = require("sequelize");

module.exports=(app,io)=>{

    //returns all data in database

    io.on('connection', function(socket){
             
        //request an update to the page when this funtion is called

        //get all Data from database
        socket.on('requestData', function(req,res){
     
            db.treedata.findAll({}).then((results)=>{
            
            io.emit("sendBackData",results)
       
            })    
        
        });

    
  


        socket.on("deleteData",(req,res)=>{
            //delete data where it matches the id
            db.treedata.destroy({
                where:{
                    id:req
                }

        })
            io.emit("confirmDelete")

        })
   
     

        socket.on('dataUpdate',(req,res)=>{
         //update data where it matches the id
            db.treedata.update({
                title:req.title,
                min:req.min,
                max:req.max,
                numArray:req.numArray
            },{
            
                where:{
                    id:req.id
                }
            })

            io.emit('dataUpdateResponse')
        })
 
  

        socket.on('postData',(req,res)=>{
            //send new data to the database
            db.treedata.create(req)

            io.emit('postResponse')
        })

           
   
    })

}