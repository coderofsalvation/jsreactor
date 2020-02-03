let runcode = require('safe-eval')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {

        let clone = (d) => {
            var t = {}
            for( var i in d ) t[i] = d[i]
            return t
        }
        
        var runJS = (input,cfg,results) => new Promise( async (resolve,reject) => {
            
            var code = `new Promise( async (resolve,reject) => {
                try{
                    ${cfg.config.js}
                    resolve(input)
                }catch(e){ reject(e) }
            })`

            var jconsole = {}
            for( var i in console ) jconsole[i] = console[i]
            jconsole.log = (str) => bre.log(str,"┋ ")

            var scope = Object.assign(opts,{
                input,
                cfg,
                clone,
                results,
                console:jconsole,
                setTimeout
            })
            try {
                var r = await runcode(code,scope)
                for( var i in r ) input[i] = r[i] // update input
            } catch (e) {
                console.log(e.stack)
                console.error(e.stack)
                input.output.error = e.stack
            }
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

