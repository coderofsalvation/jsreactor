module.exports = function(opts){

    var schema = {
        type:"object",
        
        format:"categories",
        basicCategoryTitle:"Basic",
        properties:{
            basic:{
                title:"Basic",
                type:"object",
                properties:{
                    name:{ type:"string", required:true,options:{ inputAttributes:{placeholder:"Enter rule name"}} },
                    notes:{type:"string",format:"textarea",options:{ inputAttributes:{placeholder:"Enter notes here"}}}
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

    if( opts.extraColumns ){
        var columns = schema.properties.basic.properties
        schema.properties.basic.properties = Object.assign(columns, opts.extraColumns )
    }

    return schema
}
