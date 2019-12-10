// default conditional operators from json-logic-schema
var operators = require('./../../schema.operators')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "HelloWorld" // this is the channel name
    this.description = "example plugin"  
    if( opts.defaultOperators ) this.title += " + default operators"

    this.init = async () => {
        opts.bre.log("registering "+this.title)
        this.trigger = {
            schema: [
                {
                    type:"object",
                    title:"foo equals string",
                    properties:{
                        type: bre.addType('helloEquals', async (input,cfg) => input.foo == cfg.value ),
                        foo:{ type:"string", default:"my foo"},
                        bar:{ type:"boolean"},
                        flop: { "$ref":"#/definitions/mydef"} // references to 'mydef'
                    }
                }    
            ]
        }
        
        this.action  = {
            schema: [
                {
                    type:"object",
                    title:"hello bar",
                    properties:{
                        type: bre.addType('doHello', async (input,cfg,results) => console.log("hello!") ),
                        foo:{ type:"string"}
                    }
                }            
            ]            
        }

        // optional: definitions allow you to define schemas once, and re-use them elsewhere
        this.definitions = { 
            mydef: { type:'string'}
        }

        // optional: this will add the default operators from json-rules-engine
        if( opts.defaultOperators)
            this.trigger.schema = this.trigger.schema.concat( operators('helloworld ',{type:"string",enum:['A','B']}) )
    }

    opts.bre.addChannel(this)
  
    return this
}
