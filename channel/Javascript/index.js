let runcode = require('safe-eval')
let _  	    = require('./../../_')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {
        
        var runJS = (input,cfg,results) => new Promise( async (resolve,reject) => {

            try{
                var code = `new Promise( async (resolve,reject) => {
                    try{
                        let f = async () => { 
                            ${cfg.config.js};
                            return true 
                        }
                        var res = await f()
                        resolve(res)
                    }catch(e){ reject(e) }
                })`    
            }catch(e){ return this.handleError(e,code||"",input,reject) }
            
            var jconsole = {}
            for( var i in console ) jconsole[i] = console[i]
            jconsole.log = (str,opts) => console.log( str,opts || {stream:'rule: '+input.rule.name})
            jconsole.error = function(f,id,e){
                f(`error in rule: ${id}\n`+e)
            }.bind(console,console.error,input.rule)

			let onError = (e,input,i,res) => this.handleError(e,code,input,reject)
			
			var halt;
			await bre.Channel.runMultiInput( input, async (minput,k) => {
			    var scope = Object.assign(opts,{
                    input: minput,
					cfg,
                    clone: (d) => Object.assign({},d),
                    results,
                    console:jconsole,
                    setTimeout
                })
                try {
                    var res = await runcode(code,scope,{filename:'Rule'})
                	if( res == undefined ) halt = true
					return res
				} catch (e) { return handleError(e,code,input,reject) }	
			}, onError )
            resolve( halt ? undefined : input ) // never reject since errors are handled above
        })               
        
        this.trigger = { schema: []}
        
        this.action  = {
            schema: [
                {
                    type:"object",
                    title:" ",
                    properties:{
                        type: bre.addType('javascript', runJS ),
                        config:{
                            type:"object",
                            title:"edit code",
                            options:{disable_collapse:false,collapsed:true},
                            properties:{
                                js:{ 
                                    type:"string", 
                                    title:"javascript",
                                    description:`click here <a href="${process.env.JSREACTOR_JAVASCRIPT_DOC ? process.env.JSREACTOR_JAVASCRIPT_DOC : "https://github.com/coderofsalvation/jsreactor/blob/master/doc/node/javascript.md"}" target="_blank">documentation here</a>`, 
                                    default:"//console.error('boo');\n//console.log('hello world');\ninput.output = {a:1};\ninput.output.debug = true;",
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
                }            
            ]            
        }
    }
	
	this.handleError = (e,code,input,reject) => {
		var lineStr  = String(e.stack).match(/Rule:([0-9]+):/) ? String(e.stack).match(/Rule:([0-9]+):/)[0] : 0
		var line     = parseInt( lineStr )
		var errline  = code.split("\n")[line-11] || e.stack
		var errmsg   = "⚠ "+ (errline ? errline.split("\n").slice(0,3).join("\n") : e)
		_.set(input,'output.error', e.stack )
		return reject(errmsg)
	}

    opts.bre.addChannel(this)
  
    return this
}

