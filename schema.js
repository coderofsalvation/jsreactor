module.exports = function(opts){

    return {
        type:"object",
        
        format:"categories",
        basicCategoryTitle:"Basic",
        properties:{
            basic:{
                title:"Basic",
                type:"object",
                properties:{
                    name:{ type:"string", required:true,options:{ inputAttributes:{placeholder:"Enter rule name"}} },
                    notes:{type:"string",format:"textarea",options:{ inputAttributes:{placeholder:"Enter notes here"}}},
                    language:{type:"string",default:"EN",enum: opts.languages || ['EN'] },
                    disabled:{ type:"boolean",default:false,format:"checkbox",title:"disable this rule"}       
                }
            },
            trigger:{
                title:"Trigger",
                type:"array",
                description:"All conditions below should be true",
                options:{disable_array_reorder :true},
                items:{
                    oneOf:[]
                }
            },  
            action:{
                title:"Action",
                type:"array",
                uniqueItems: true,
                items:{
                    oneOf:[]
                }
            }
        },
        definitions:{}
    }
}
