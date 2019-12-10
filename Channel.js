/*
 * These are channel related functions used by BRE.js
 */

var _       = require('./_')
var get     = _.get
var peach   = require('promise-each')

function Channel(bre){

    this.addTriggers = (c) => {
        // add channel (= dynamic Fact) to json-rules-engine npm package
        bre.engine.addFact(c.title, (params, f) => {
            return new Promise( async (resolve, reject) => {
                try{
                    var vars = {}
                    var input = _.mapToObject(f.factMap)
                    for( var i in input ) if( input[i].value ) vars[i]  = input[i].value
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
            if( type.operator )
                bre.engine.addOperator( type.default, type.operator )
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

    this.runAction = async (channel,operator,facts,results) => new Promise((resolve,reject)=> {
        Promise.resolve( channel.action.schema )
        .then( peach( async (a) => {
            if( get(operator,'config.type') == get(a,'properties.type.default') ){
                if( get(a,'properties.type.operator') ){
                    return a.properties.type.operator(facts,operator.config,results)
                }
            }
        }))
        .then(resolve)
    })

    this.runActions = async (ruleAction,facts,results) => new Promise( (resolve,reject) => {
        if( !ruleAction.params ) return resolve()
        Promise.resolve(ruleAction.params)
        .then( peach( (operator) => new Promise( async (resolve,reject) => {
                try{
                    var t = new Date().getTime()
                    var channel = bre.channels[operator.channel]
                    if( channel){
                        var c = channel.instance
                        bre.log(`ACTION ${operator.channel} (${facts.runid})`)
                        await this.runAction(c,operator,facts,results)    
                    }else console.error(operator.channel+"-channel does not exist")
                    resolve()
                }catch(e){ console.error(e); }
            })
        ))
        .then( resolve )
    })

    return this
}

module.exports = function(bre){ return new Channel(bre) }