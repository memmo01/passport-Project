let db = require("../models");
let Sequelize = require("sequelize");

module.exports=(app)=>{

    //returns all data in database
    app.get("/api/getAllData",(req,res)=>{
        db.treedata.findAll({}).then((results)=>{
            res.json(results)
        })
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