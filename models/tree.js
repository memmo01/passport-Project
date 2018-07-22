
module.exports=(sequelize,DataTypes)=>
{
    let Data = sequelize.define("treedata",{
        title:DataTypes.STRING,
        min:DataTypes.INTEGER,
        max:DataTypes.INTEGER,
        numArray:DataTypes.TEXT
    },{
        timestamps:false
    });

    return Data;
}