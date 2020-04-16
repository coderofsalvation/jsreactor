let runcode = require('safe-eval')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {
        
        var runJS = (input,cfg,results) => new Promise( async (resolve,reject) => {
            
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

            var jconsole = {}
            for( var i in console ) jconsole[i] = console[i]
            jconsole.log = (str,opts) => bre.log(str,"┋ ",opts)
            jconsole.error = function(f,id,e){
                console.dir(input)
                f(`error in rule: ${id}\n`+e)
            }.bind(console,console.error,input.rule)

            var inputs = input[0] ? input : [input] // support multi-input
            
            var errors = 0
            for( var x =0; typeof inputs[x] == 'object' ; x++ ){
                var scope = Object.assign(opts,{
                    input: inputs[x],
                    cfg,
                    clone: (d) => Object.assign({},d),
                    results,
                    console:jconsole,
                    setTimeout
                })

                try {
                    var res = await runcode(code,scope,{filename:'Rule'})
                    if( typeof res == 'object ') for( var i in res ) inputs[x][i] = res[i] // update input
                    else errors += res ? 0 : 1 
                } catch (e) {
                    var lineStr  = String(e.stack).match(/Rule:([0-9]+):/) ? String(e.stack).match(/Rule:([0-9]+):/)[0] : 0
                    var line     = parseInt( lineStr )
                    var errline  = code.split("\n")[line-11] || e.stack
                    var errmsg   = "⚠ "+ (errline ? errline.split("\n").slice(0,3).join("\n") : e)
                    inputs[x].output = inputs[x].output || {}
                    inputs[x].output.error = e.stack
                    return reject(errmsg)
                }
            }
            console.dir(errors)
            resolve(input) // never reject since errors are handled above
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

    opts.bre.addChannel(this)
  
    return this
}

