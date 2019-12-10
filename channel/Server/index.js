let runcode = require('safe-eval')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Server"
    this.description = "events happening on the server"  
    this.init = async () => {
        
        this.trigger = {
            schema: [
                {
                    type:"object",
                    title:"server boots up",
                    properties:{
                        type: bre.addType('serverboot', (input,cfg,results) => process.booted ? false : (process.booted = true)),
                    }
                }           
            ]    
        }
        this.action  = {schema:[]}        
    }

    opts.bre.addChannel(this)
  
    return this
}

