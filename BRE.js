var _       = require('./_')
var get     = _.get
var jre     = require('json-rules-engine')
var debug   = require('debug')('bre')

function BRE(adapter,opts){
    var Channel = require('./Channel')(this)
    opts            = opts || {}
    this.log        = (s) => console.log(`bre: ${s}`)
    this.schema     = {}
    this.channels   = {}
    this.log("initing")

    // rules engine
    this.engine = new jre.Engine()
    this.toJSON   = ( ) => JSON.stringify( this.engine.rules.map( (r) => r.toJSON() ) )
    this.loadJSON = (j) => JSON.parse(j).map( (jstr) => this.engine.addRule(new Rule(jstr) ) )
    
    this.addChannel  = Channel.addChannel.bind(this) // alias
    this.addType     = Channel.addType 

    this.init = async () => {
        this.schema = require('./schema.js')(opts)
        this.engine = new jre.Engine()
        require('./operators')(this.engine) // add custom operators
        for( var i in this.channels ){ 
            var c = this.channels[i]
            await c() // re-init schemas
            Channel.addTriggers(c.instance)
            Channel.addOperators(c.instance)
        }
        await this.loadRules()
    }
    
    // this is a placeholder which can be overruled from outside (to keep things orm-agnostic)
    this.loadRuleConfigs = () => {
        return new Promise( (resolve,reject) => resolve() )
    }

    // this is a placeholder which can be overruled from outside (to keep things orm-agnostic)
    this.getInstalledTriggers = (channel) => {
        return new Promise( (resolve,reject) => resolve() )
    }

    // this is a placeholder which can be overruled from outside (to keep things orm-agnostic)
    this.onDatabaseSave = ( table, cb ) => {}
    
    this.loadRules = () => new Promise( (resolve,reject) => {
        debug("processing rules")
        this.loadRuleConfigs()
        .then( (rules) => {
            rules.map( (rule) => {
                if( !rule.config.trigger ) return
                var r = {
                    name: _.get(rule,'config.basic.name','no name'),
                    conditions: {
                        all: rule.config.trigger.map( (t) => 
                            Object.assign({
                                    fact:t.channel,
                                    operator: t.config.type,
                                    value: t.config,
                                },
                                t.config
                            )
                        )
                    },
                    event: {
                        type: rule.config.action[0] ? rule.config.action[0].channel : '',
                        params: rule.config.action
                    }
                }
                debug(JSON.stringify(r,null,2))
                this.engine.addRule(r)
            })
        })
        .then(resolve)
        .catch( reject )
    })

    this.run = async (facts) => new Promise( async (resolve,reject) => {
        var t     = new Date().getTime()
        facts.runid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 7) 
        await this.init()
        debug("run("+JSON.stringify(facts)+")")
        var res = {runid: facts.runid, triggers: (new Date().getTime()-t)+"ms",actions:"0ms"}
        this.engine.on('success', (event,almanac,result) => {
            this.log(`TRIGGER '${result.name}' (${facts.runid})`)
        })

        this.engine.run(facts)
        .then( async (results) => {
            res.actions = results.events.length
            if( results.events.length == 0 ) return resolve(res)
            results.events.map( async (e) => await Channel.runActions(e,facts,results) )
            res.actions = (new Date().getTime()-t)+"ms"
            return resolve(res)
        })
        .catch( (e) => {
            this.log(JSON.stringify(res)) 
            reject(e)
        })
    })

    // endpoints
    this.endpoint = {}
    this.endpoint.breGetSchema = async (params) => {
        await this.init()
        return this.schema
    }
    this.endpoint.bre       = async (params) => {
        var result = await this.run(params)
        return result
    }

    if(adapter) adapter(this)
    
    return this
}

BRE.operators = require('./schema.operators')

module.exports = BRE