function matchPattern(req,cfg){
    return req.url.match( cfg.regex ? new RegExp(cfg.pattern) : cfg.pattern ) != null ? true : false
}

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
 
        this.trigger.schema.unshift({
            type:"object",
            title:"webrequest",
            properties:{
                type: bre.addType('web_request_in', (input,cfg,results) => {
                    if( !input.web_request_in ) return false
                    var match = matchPattern(input.req(),cfg)
                    if( match && !cfg.blocking ) input.req().next()
                    return match
                }),
                pattern:{type:"string",default:"/foo.html",description:"turn on regex for patterns like ^\\/(foo|bar)$ e.g."},
                regex:{type:"boolean",format:"checkbox",default:false,title:"regex"},
                blocking:{type:"boolean",format:"checkbox",default:false,description:"block middleware further in the chain"}
            }            
        })
    
        this.action  = {schema:[]}        
    }

    opts.bre.addChannel(this)
  
    return this
}

// usage in express: 
//    app.use( require('@coderofsalvation/jsreactor/channel/Server').middleware )

module.exports.middleware = (req,res,next) => {
    if( !process.bre || !process.bre.rules ) return next()
    process.bre.express = true
    var triggers = process.bre.rules.filter( (r) => {
        if( !r.config || !r.config.trigger ) return false
        var matches = r.config.trigger.filter( (t) => {
            return  t.channel == 'Server' &&
                    t.config.type == "web_request_in" && 
                    matchPattern(req,t.config)
        })
        return matches.length ? matches : false
    })
    if( triggers.length ){
        process.bre.run({
            web_request_in:true,
            flop:1,
            "req": () => req,
            "res": () => res,
            "next": next
        })
    }else next()
}
