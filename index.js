const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express ();
dotenv.config();

const port = process.env.PORT || 5001;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.31fi0lj.mongodb.net/registrationForminDB`, {
});
const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            return /^\d{10}$/.test(value);
          },
          message: 'Please enter a valid 10-digit phone number.',
        },
      },
    });
const Registration = mongoose.model('Registration',registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req, res) => {
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register",async (req, res)=> {
    try{
        const {name, email, password, phone, gender} = req.body;

        const existingUser=await Registration.findOne({email:email});
        if(!existingUser){
            const registrationData=new Registration({
                name,
                email,
                password,
                phone,
                gender
            });
            await registrationData.save();
            res.redirect("/success");
         }
         else{
            console.log("user already exists");
            res.redirect("/error");
         }   
     }

     
    catch(error){
        console.log("Error in saving data to database : ",error);
        res.redirect("error");

    }
})

app.get("/succes",(req, res)=>{
    res.sendFile(__dirname+"pages/success.html");
})
app.get("/error",(req, res)=>{
    res.sendFile(__dirname+"pages/error.html");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})

