// default conditional operators from json-logic-schema
var operators = require('./../../schema.operators')
var _         = require('./../../_')
let validate  = require('tv4').validate

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Input" // this is the channel name
    this.description = "triggers actions based on input-data"  
    
    this.init = async () => {
        opts.bre.log("registering "+this.title)
        this.trigger = {
            schema: operators('input ',{type:"string",options:{inputAttributes:{placeholder:".foo"}}})
        }

        this.validateSchema = (input,cfg,results) => {
            console.log("checking input Validateschema")
            try{
                var res = validate( input, JSON.parse(cfg.config.schema) )
                return res === true
            }catch(e){ 
                return false 
            }
        }
        
        // append default operators
        this.trigger.schema.push({
            type:"object",
            title:"validate against jsonschema",
            properties:{
                type: bre.addType('inputValidateSchema', this.validateSchema),
                config:{
                    type:"object",
                    title:"edit schema",
                    options:{disable_collapse:false,collapsed:true},
                    properties:{
                        schema:{ 
                            type:"string", 
                            title:"jsonschema",
                            default:JSON.stringify({
                                "type":"object",
                                "properties":{
                                  "action":{
                                    "type":"string",
                                    "pattern":"^foo$",
                                    "required":true
                                  },
                                  "param1":{
                                    "type":"boolean",
                                    "required":true
                                  },
                                  "param2_optional":{
                                    "type":"integer",
                                    "minimum":0
                                  }
                                }
                            },null,2),
                            "description":'example validates {action:"foo",param1:false}',
                            format: "javascript",
                            "options": {
                                "ace": {
                                    "theme": "ace/theme/monokai",
                                    "tabSize": 2,
                                    "useSoftTabs": true,
                                    "wrap": true,
                                    maxLines:20,
                                    minLines:20,
                                    fontSize:'14px'
                                }
                            }
                        }
                    }
                }
            }
        })
        
        
        this.action  = {
            schema: []            
        }
    }

    opts.bre.addChannel(this)
  
    return this
}
