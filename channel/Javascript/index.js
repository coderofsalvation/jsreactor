let runcode = require('safe-eval')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {
        
        var runJS = (input,cfg,results) => new Promise( async (resolve,reject) => {
            var code = `new Promise( async (resolve,reject) => {
                ${cfg.js}
                resolve(input)
            })`
            var scope = Object.assign(opts,{
                input,
                cfg,
                results,
                log: (str) => bre.log(str,"         ↑  "),
                console,
                error:console.error    
            })
            try {
                var r = await runcode(code,scope)
                for( var i in r ) input[i] = r[i] // update input
                console.dir(input)
            } catch (e) {
                console.log(e.stack)
                console.error(e.stack)
            }
            resolve() // never reject since errors are handled above
        })               
        
        this.trigger = { schema: []}
        
        this.action  = {
            schema: [
                {
                    type:"object",
                    title:" ",
                    properties:{
                        type: bre.addType('javascript', runJS ),
                        js:{ 
                            type:"string", 
                            title:"code",
                            description:"async (input,cfg,results,log,error) => { ... }", 
                            default:"//input.users = await Parse.Query('User').limit(2).find()\n//error('boo')\n//log('hello world')\nreturn input\n",
                            format: "javascript",
                            "options": {
                                "ace": {
                                    "theme": "ace/theme/monokai",
                                    "tabSize": 2,
                                    "useSoftTabs": true,
                                    "wrap": true,
                                    maxLines:10,
                                    minLines:10,
                                    fontSize:'14px'
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

