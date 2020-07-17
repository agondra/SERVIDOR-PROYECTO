var mongoose = require('mongoose');

var MedidasSchema = new mongoose.Schema({

    idUser:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
        
    },
    ira:{
        type:Boolean,
        required:true,
        trim:true
        
    },
    tristeza:{
        type:Boolean,
        required:true,
        trim:true        
    },
    miedo:{
        type:Boolean,
        required:true,
        trim:true        
    },
    preocupacion:{
        type:Boolean,
        required:true,
        trim:true        
    },
    impulsividad:{
        type:Boolean,
        required:true,
        trim:true        
    },
    tc:{
        type:Number,
        required:true,
        trim:true        
    },
    startDate:{
        type:Date
    }
    
});
 


 
module.exports = mongoose.model('Medidas', MedidasSchema);