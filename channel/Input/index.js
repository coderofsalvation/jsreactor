// default conditional operators from json-logic-schema
var operators = require('./../../schema.operators')
var _         = require('./../../_')

module.exports = function(opts){
    var bre          = opts.bre
    var Parse        = bre.Parse
    this.title       = "Input" // this is the channel name
    this.description = "triggers actions based on input-data"  
    
    this.init = async () => {
        opts.bre.log("registering "+this.title)
        this.trigger = {
            schema:  operators('input ',{type:"string",options:{inputAttributes:{placeholder:".foo"}}})
        }
        
        this.action  = {
            schema: []            
        }
    }

    opts.bre.addChannel(this)
  
    return this
}
