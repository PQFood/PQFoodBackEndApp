const mongoose = require('mongoose');

async function connect(){
    try{
        //await mongoose.connect('mongodb://localhost:27017/pqshop');
        await mongoose.connect('mongodb+srv://phong:phong@cluster0.ymdj9.mongodb.net/pqfood?retryWrites=true&w=majority');
        console.log('connect sucessfully!!!')
    }
    catch(error)
    {
        console.log('connect failure!!!')
    }
}

module.exports = {connect}
