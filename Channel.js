/*
 * These are channel related functions used by BRE.js
 */

var _       = require('./_')
var get     = _.get
var peach   = require('promise-each')

function Channel(bre){

    this.addTriggers = (c) => {
        // add channel (= dynamic Fact) to json-rules-engine npm package
        bre.engine.addFact(c.title, async (params, f) => {
            return new Promise( async (resolve, reject) => {
                try{
                    var vars = {}
                    var input = _.mapToObject(f.factMap)
                    for( var i in input ){
                        if( input[i].type == 'CONSTANT' && input[i].value ) vars[i]  = input[i].value
                        if( input[i].type == 'DYNAMIC'                    ) vars[i]  = input[i].calculationMethod
                    }
                    resolve(vars)
                } catch(e){ reject(e) }
            })
        })
    }

    this.addType = (name,operator) => {
        var schema = {type:"string",default:name,pattern:`^${name}$`,options:{hidden:true}}
        if( operator ) schema.operator = operator 
        return schema                        
    }

    this.addOperators = (c) => {
        c.trigger.schema.map( (s) => {
            var type = s.properties.type
            if( !type.default )
                return console.warn(`channel ${c.title} has no default type-prop :/`)
            if( type.operator ){
                // wrap the function so we can pass succesful triggerdata to actions
                let cb = async (operator,input,cfg,results) => {
                    try{
                        if( ! (await operator(input,cfg,results)) ) return false 
                        input.trigger[ c.title ] = cfg
                    }catch(e){ console.error(e.stack) }
                    return true
                }
                bre.engine.addOperator( type.default, cb.bind(null,type.operator) )
            }
        })
    }
    
    this.addChannel = function( c ){
        this.channels[c.title] = async () => {
            await c.init()
            if( !get(c,'trigger.schema') ) throw `${c.title}: trigger.schema-object not found in module.exports`
            if( !get(c,'action.schema' ) ) throw `${c.title}: action.schema-object not found in module.exports`
            
            var cSchema = (type,types) => {
                var s = {
                    "type":"object",
                    title: c.title,
                    id:c.title,
                    description:c.description,
                    properties:{
                        channel: {"type":"string",options:{hidden:true},"pattern":`^${c.title}$`,default:c.title},
                        config:{
                            title:type,
                        }
                    }
                }
                s.properties.config = types.length > 1 ? {title:type, oneOf: types }
                                                       : types[0]
                return s
            }
            if( c.definitions ) this.schema.definitions = Object.assign(this.schema.definitions,c.definitions)
            if( c.trigger.schema.length )     this.schema.properties.trigger.items.oneOf.push(cSchema("trigger",c.trigger.schema))
            if( c.action.schema.length  )     this.schema.properties.action.items.oneOf.push(cSchema("action",c.action.schema))  
        }
        this.channels[c.title].instance = c
        this.log(`addChannel(${c.title})`)
    }

    this.runAction = (channel,operator,facts,results) => new Promise( async (resolve,reject)=> {
        var result
        for( var i in channel.action.schema ){
            var a = channel.action.schema[i]
            if( get(operator,'config.type') == get(a,'properties.type.default') ){
                if( get(a,'properties.type.operator') ){
                    try{ 
                        result = await a.properties.type.operator(facts,operator.config,results) 
                    }
                    catch(e){ return reject(e) }
                }
            }
        }
        resolve(result)
    })
	
	this.runMultiInput = async (input,cb,onerror) => {
		var inputs = input[0] ? input : [input] // always enforce multi-input    
        var halt
		var res = []
        for( var x =0; typeof inputs[x] == 'object' ; x++ ){	
			try{ 
				res[x] = await cb(inputs[x]) 
			    if( typeof res[x] == 'object ') for( var i in res[x] ) inputs[x][i] = res[x][i] // update input
                input.output = Object.assign(input.output,inputs[x].output)			
			}catch(e){ onerror(e,inputs[x],x,res) }
		}
		return res
	}

    this.runActions = (rule,facts,results) => new Promise( async (resolve,reject) => {
        if( !rule ) return resolve()
        for( var i in rule.config.action){
            var operator = rule.config.action[i]
            var t = new Date().getTime()
            var channel = bre.channels[operator.channel]
            if( !channel ){
                console.error(operator.channel+"-channel does not exist")   
                continue
            }
            var c = channel.instance
            bre.log(`[${rule.name}] ACTION ${operator.channel} (#${facts.runid})`)
            // lets always assume multi-input:
			//   facts.output.input --- in case a trigger produces multi-input
			//   facts              --- normal (single-input) scenario
			var inputs = facts.output.input ? facts.output.input : [facts]
            var errors = 0
            var halt
			var res 
            for( var j = 0; inputs[j] != undefined; j++ ){
                var input = Object.assign(  _.omit(['output'],facts), 
                                            inputs[j], 
                                            {rule:{name:rule.name,ref:`${process.env.JSREACTOR_EDIT_URL||'#'}${rule.objectId}`}} )
                input.output = _.omit(['input'],facts.output)
				try{ 
                    res = await this.runAction(c,operator,input,results) 
                    if( res == undefined ) halt = true
                }catch(e){
                    console.error(e+`\n\tin rule: ${input.rule.name} ${input.rule.ref}`)
                    errors += 1
                }
				var output = Object.assign(facts.output, _.get(res,'output',{}) )
				for( var x in input ) facts[x] = input[x]
				facts.output = output
			}
			if( halt || errors == j ){
				bre.log("errors="+errors+' action='+j+" halt="+(halt?"yes":"no"))
				break; // halt further execution if everything errors         
			}
		}
        resolve(facts)
    })

    return this
}

module.exports = function(bre){ return new Channel(bre) }