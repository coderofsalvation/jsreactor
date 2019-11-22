module.exports = function(opts){
    var bre          = opts.bre
    var Parse        = bre.Parse
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {
        this.trigger = {
            schema: []
        }
        
        this.action  = {
            schema: [
                {
                    type:"object",
                    title:"code",
                    properties:{
                        type:{type:"string",default:"javascript",pattern:"^javascript$",options:{hidden:true}},
                        js:{ type:"string", format:"textarea", default:"app.get('/foo', (req,res,next) => res.send('hello') )"}
                    }
                }            
            ]            
        }
    }

    opts.bre.addChannel(this)
  
    return this
}
