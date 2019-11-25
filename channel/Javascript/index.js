module.exports = function(opts){
    var bre          = opts.bre
    var Parse        = bre.Parse
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {
        
        var runJS = async (input,cfg,results) => {
            new Function( 'input', 'cfg', 'results', 'log','error',cfg.js )(input,cfg,results,bre.log,console.error)
        }               
        
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
                            description:"(input,cfg,results,log,error) => { ... }", 
                            default:"//input.users = await Parse.Query('User').limit(2).find()\n//error('boo')\n//log('hello world')\nreturn input\n",
                            format: "javascript",
                            "options": {
                                "ace": {
                                    /*"theme": "ace/theme/vibrant_ink",*/
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

