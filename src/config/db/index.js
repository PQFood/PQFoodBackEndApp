const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://<name>:<password>@cluster0.ymdj9.mongodb.net/?retryWrites=true&w=majority');
        console.log('connect sucessfully!!!')
    }
    catch(error)
    {
        console.log('connect failure!!!')
    }
}

module.exports = {connect}
