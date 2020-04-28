var z = require('zora')
var _ = require('./../../_')
var jre   = require('json-rules-engine')
var b /*BRE engine */
var HelloWorld = require('./../../channel/HelloWorld')

require('./error')
require('./immutable')
require('./multi-input')
require('./helloworld')
require('./multiaction')
require('./concurrency')
require('./multirule-with-return')
require('./lodashfunctions')

z.test('some grouped assertions', t => {
    t.ok(true, 'true is truthy')
    t.equal('bar', 'bar', 'that both string are equivalent')
    t.isNot({}, {}, 'those are not the same reference')
})

z.test('BRE init', t => {
    var BRE = require('./../../BRE')
    b = new BRE() // index.js
    var json = b.toJSON()
    b.loadJSON(json)
    t.ok(true,'all fine')
})

z.test('BRE rules engine test', t => {
    /**
     * Rule for identifying microsoft employees taking pto on christmas
     */
    b.engine.addRule({
      conditions: {
        all: [{
          fact: 'User object',
          operator: 'equal',
          value: 'microsoft',
          path: '.company' // access the 'company' property of "account-information"
        }]
      },
      event: {
        type: 'microsoft-christmas-pto',
        params: {
          message: 'current microsoft employee taking christmas day off'
        }
      }
    })

    b.engine.addFact('User object', function (params, f) {
      return new Promise( (resolve, reject) => {
        f.factValue('accountId')
        .then( (id) => resolve({company:'microsoft', id}) )
      })
    })

    // define fact(s) known at runtime
    let facts = { accountId: 'lincoln' }
    b.engine
    .run(facts)
    .then((results) => {
        t.ok(true, 'all fine')
        console.log(facts.accountId + ' triggered events: ' + results.events.map(event => event.params.message))
    })
    .catch(err => t.ok(false, err.stack) )
})

z.test('load Rule Configs (HelloWorld)',  async (t) => {
  b.engine = new jre.Engine()
  new HelloWorld({bre:b})

  b.loadRuleConfigs = () => {
     return new Promise( (resolve, reject) => resolve([
      {
        "createdAt": "2019-11-10T13:47:45.696Z",
        "updatedAt": "2019-11-10T13:47:59.796Z",
        "name": "test",
        "config": {
          "basic": {
            "name": "test",
            "notes": "test",
            "disabled": false
          },
          "action": [
            {
              "config": {
                "config":{
                  "js": "console.log(\"foo\")",
                },
                "type": "javascript"   
              },
              "channel": "Javascript"
            }
          ],
          "trigger": [
            {
              "config": {
                "type": "helloEquals",
                "value": "123"
              },
              "channel": "HelloWorld"
            }
          ]
        },
        "triggerChannel": "Url",
        "objectId": "3Kiu8bXNd6"
      }
     ]))
  }
  console.log("running engine")
  await b.run({foo:123,bar:true})
})
