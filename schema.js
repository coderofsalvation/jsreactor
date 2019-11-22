module.exports = function(){

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
                    disabled:{ type:"boolean",default:false,format:"checkbox",title:"disable this rule"},
                    notes:{type:"string",format:"textarea",options:{ inputAttributes:{placeholder:"Enter notes here"}}}        
                }
            },
            trigger:{
                title:"Trigger",
                type:"array",
                description:"Below are conditions, which need to be true, in order to execute the action-tab",
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
