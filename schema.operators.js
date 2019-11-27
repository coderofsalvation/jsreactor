module.exports = (slug,path) => [
    {
        title:slug+"has property",
        type:'object',
        properties:{
            type:{ type:'string', 'default':'exist',pattern:'^exist$',options:{hidden:true}},
            path
        }
    },
    {
        title:slug+"equals",
        type:'object',
        properties:{
            type:{ type:'string', 'default':'equal',pattern:'^equal$',options:{hidden:true}},
            path,
            value:{ type:'string',default:'my value'}
        }
    },
    {
        type:'object',
        title:slug+"does not equal",
        properties:{
            type:{ type:'string', 'default':'notEqual',pattern:'^notEqual$',options:{hidden:true}},
            path,
            value:{ type:'string',default:'my value'}
        }
    },
    {
        type:"object",
        title:slug+"contains one of these values",
        properties:{
            type:{ type:'string', 'default':'in',pattern:"^in$",options:{hidden:true}},
            path,
            value:{ type:'string',default:'value1,value2'}
        }
    },
    {
        title:slug+'does not contain one of these values',
        type:'object',
        properties:{
            type:{ type:'string', 'default':'notIn',pattern:"^notIn$",options:{hidden:true}},
            path,
            value:{ type:'string',default:'my value'}
        }
    },
    {
        title:slug+'matches certain value',
        type:'object',
        properties:{
            type:{ type:'string', 'default':'contains',pattern:"^contains$",options:{hidden:true}},
            path,
            value:{ type:'string',default:'my value'}
        }
    },
    {
        type:'object',
        title: slug+'does not matches certain value',
        properties:{
            type:{ type:'string', 'default':'doesNotContain',pattern:"^doesNotContain$",options:{hidden:true}},
            path,
            value:{ type:'string',default:'my value'}
        }
    },
    {
        type:'object',
        title:slug+'is less than',
        properties:{
            path,
            type:{ type:'string', 'default':'lessThan',pattern:"^lessThan$",options:{hidden:true}},
            value:{ type:'string',default:123}
        }
    },
    {
        type:'object',
        title:slug+'is less than or equals',
        properties:{
            type:{ type:'string', 'default':'lessThanInclusive',pattern:"^lessThanInclusive$",options:{hidden:true}},
            path,
            value:{ type:'string',default:"123"}
        }
    },
    {
        type:'object',
        title:slug+'is greater than',
        properties:{
            type:{ type:'string', 'default':'greaterThan',pattern:"^greaterThan$",options:{hidden:true}},
            path,
            value:{ type:'string',default:123}
        }
    },
    {
        type:'object',
        title:slug+'greater than or equals',
        properties:{
            type:{ type:'string', 'default':'greaterThanInclusive',pattern:"^greaterThanInclusive$",options:{hidden:true}},
            path,
            value:{ type:'string',default:123}
        }
    }
]
