  
    $(document).ready(()=>{

    
    let dataResults;
    let selectedObj;
    let socket = io()
    


    let load =()=>{
         
        //on load get all data in database
                socket.emit('requestData');        
                
                socket.on("sendBackData",(res)=>{
             
                 dataResults=(res)
                 sortData(res)
                
                })
    }
        
         
         
    
    load()

        //this function sorts data and converts it into individual factories with corresponding nodes listed below
        sortData=(results)=>{

           let info= results.map(results=>
                {
                    let numArray = JSON.parse(results.numArray)

                    let title= $("<div>");
                        title.addClass("individualFactory");
                   
                    let titleText=$("<div>")
                        titleText.attr("onclick",'handleTitleClick(this);')
                        titleText.attr("data-id",results.id)
                        titleText.addClass("factoryTitle")
                        titleText.text(results.title)
                    
                        $(title).append(titleText)

                        let rangeText = $("<div>")
                        rangeText.text(`${results.min} : ${results.max}`)
                        rangeText.addClass('numRangeText')
                        $(title).append(rangeText)

                        
                    numArray.map(numberSort=>{

                        let arrNumber = $("<li>")
                            arrNumber.addClass("randomNums");
                            arrNumber.text(numberSort)

                            title.append(arrNumber)
                    })

                    return title
                    
                })
                    

                $(".factoryData").html(info)
               
        }


        //on click get the id of the factory clicked
        //when clicked it will populate a modal displaying current information and allowing user to update info
        //it will take the id of the title clicked and get the specific information about that object from an array that hold all
        //data it collected on the get
          handleTitleClick=(e)=>{

            

            let id=e.dataset.id;

            // 1.findIndex of id in dataResults array
            let index = dataResults.findIndex(res=>res.id == id)
           
            //2. get specific object from dataResults
            let item =dataResults[index]

            selectedObj =item;
            //3. then prepopulate a form containing current info they can see and
                //change if they want to
                createForm(item,"addData")
            // console.log(data[0])

            
        }


        createForm=(item,type)=>{
            $(".modal").css("display","block")
            let quantity =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            let options = quantity.map(numOption=>{ return `<option key=${numOption} value=${numOption}>${numOption}</option>`} )
            let form;

            if(type === "addData"){
                form = addDataForm(item)
                $(".modalBody").html(form)
            }
            else if(type ==="newData"){
                form= newDataForm(options)
                $(".modalBody").html(form)
            }            

                

        }

        addDataForm=(item)=>{
           
            let form=`<form id='form'onSubmit='handleUpdateFormSubmit(this)'>`;
                form+=`<label>Edit Title</label><br>`;
                form+=`<input type='text' name='title' required='required' pattern='^[a-zA-Z0-9 ]*$' value=${item.title}><br>`;
                form+=`<label>Enter Range Low to High</label><br>`;
                form+=`<input type='number' required='required' name='min' value=${item.min}>`;
                form+=`<input type='number' required='required' name='max' value=${item.max}><br>`;
                form+=`<input type="submit" id='editFactoryBtn'required='required' name="submitchanges"/><br/>`
                form+=`</form>`
                form+=`<button id='deleteBtn' onClick='handleDelete()'>Delete Factory</button>`

                return  form;

        }
            newDataForm=(options)=>{

                let form=`<form id='form'onSubmit='handleNewFormSubmit(this)'>`;
                form+=`<label>Add Title</label><br>`;
                form+=`<input type='text' name='title' required='required' pattern='^[a-zA-Z0-9 ]*$' placeholder='Enter Title'><br>`;
                form+=`<label> How Many Nodes?</label><br>`;
                form+=`<select name='nodeValue'>${options}</select><br>`;
                form+=`<label>Enter Range</label><br>`;
                form+=`<input type='number' required='required' name='min' placeholder='min'>`;
                form+=`<input type='number' required='required' name='max' placeholder='max'><br>`;
                form+=`<input type="submit" required='required' id='submitChanges' name="submitchanges"/><br/>`
                form+=`</form>`

                return  form;

            }

        //this takes the data and sends it to the database for new entry or to be updated
        handleUpdateFormSubmit=(form)=>{
                event.preventDefault()
                 
                    let formData={
                        id:selectedObj.id,
                        title:(form['title'].value),
                        min:(form['min'].value),
                        max:(form['max'].value),
                        numArray:selectedObj.numArray
                    }

                 if(parseInt(formData.max) < parseInt(formData.min)){
                    alert("please check your ranges")
                }
                else{

                    $(".modal").css("display","none")

                    checkChangeInRange(formData)

                }
        }


        checkChangeInRange=(formData)=>{

            let max = parseInt(formData.max);
            let min = parseInt(formData.min)

            let currentArray=JSON.parse(formData.numArray)
            
        if(min ==selectedObj.min){
           updateDatabase(formData)

        }  
         else{      
                   let newArray=currentArray.map(num=>{
                    
                    return randomNumGenerater(max,min)                 
                   
                })

                formData.numArray = JSON.stringify(newArray);
                updateDatabase(formData)
            
          
        }
        }


        randomNumGenerater=(max,min)=>{
                let generatedNum=Math.floor(Math.random()*(max-min +1)+min);
                return generatedNum;
        }




        //new form submitted
                handleNewFormSubmit=(form)=>{
                event.preventDefault()

                let max = form['max'].value;
                let min = form['min'].value;
                let nodes = form['nodeValue'].value;
                let title= form['title'].value;

                if(parseInt(max) < parseInt(min)){
                    alert("you need to make changed to your range")
                }
                else{

                    let formData={
                        title:title,
                        min:min,
                        max:max,
                        numArray:nodes
                    }

                    //creating new random number array based on how many nodes the user selects and the range of numbers
                    numberArray=[];
                    for(let i=0;i<nodes;i++){
                        let random = Math.floor(Math.random()*(parseInt(max)-parseInt(min)+1)+parseInt(min))
                        numberArray.push(random)
                    }

                    formData.numArray=JSON.stringify(numberArray)

                    form['max'].value="";
                    form['min'].value="";
                    form['title'].value="";

                    $(".modal").css("display","none")
                    
                    addToDatabase(formData);



                }
               



        }

        addToDatabase=(formData)=>{

                socket.emit('postData',formData)

                socket.on('postResponse',()=>{
                     load()
                })
                
           
        }

        handleDelete=()=>{
            event.preventDefault()
            $(".modal").css("display","none")
            
                deleteItem=selectedObj.id

                socket.emit("deleteData",deleteItem);

                socket.on('confirmDelete',()=>{
                    load()
                })
        }



        updateDatabase=(formData)=>{

            socket.emit('dataUpdate',formData);
                socket.on('dataUpdateResponse',()=>{
                    load();
                })
            


        }

        closeModal=()=>{
            $(".modal").css("display","none")

        }

       
        })