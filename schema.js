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
                title:"⚡ Trigger",
                type:"array",
                description:"All blocks below should be true (AND)",
                options:{disable_array_reorder :true},
                items:{
                    oneOf:[]
                }
            },  
            action:{
                title:"💥 Action",
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
        schema.properties.extra = {
            type:"object",
            title:"Extra",
            properties:opts.extraColumns
        }
    }

    return schema
}
