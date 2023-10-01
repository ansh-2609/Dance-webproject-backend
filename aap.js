const path = require("path");
const express = require("express");
const dotenv = require("dotenv")
const app = express()
const mongoose = require('mongoose');


dotenv.config({path: "./.env"})

const Database_path = process.env.DATABASE;
const Port = process.env.PORT || 80;


// Connecting node application with the mongodb
mongoose.connect(Database_path, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("We are connected");
});

// Define mongoose schema and model
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String,

  });

const contact = mongoose.model('Contact', contactSchema);  
  
// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('../client/static'));
app.use(express.urlencoded({ extended: true }))

//  PUG SPECIFIC STUFF
// app.set('views', '../client/view')
// app.set('view engine', 'html')



// ENDPOINTS
app.get('/', (req, res)=>{
    const filePath = path.join(__dirname, '../client/view/index.html');
    res.sendFile(filePath);
})

app.get('/contact', (req, res)=>{
    const filePath = path.join(__dirname, '../client/view/contact.html');
    res.sendFile(filePath);
})


app.post('/contact', (req, res)=>{
    const mydata = new contact(req.body)
    mydata.save().then(()=>{
        res.send("The data has been saved to the database")  
    }).catch(()=>{
        res.status(400).send("Data has not saved to the database")
    })
})

if(process.env.NODE_ENV == "production"){
    app.use(express.static("./client/view"))
   }

// START THE SERVER
app.listen(Port, ()=>{
    console.log(`Server running at localhost:${Port}`);
})