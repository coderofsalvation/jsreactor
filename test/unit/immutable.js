var z = require('zora')
var _ = require('./../../_')
var jre   = require('json-rules-engine')
var b /*BRE engine instance*/
var BRE = require('./../../BRE')
var HelloWorld = require('./../../channel/HelloWorld')
var Javascript = require('./../../channel/Javascript')

z.test('init BRE',  async (t) => {
  b = new BRE() // index.js
  b.engine = new jre.Engine()
  new HelloWorld({bre:b})
  new Javascript({bre:b})
  t.ok(true,"inited")
})

z.test('loadRuleConfigs', async (t) => {
    
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
              "type": "javascript",
                "config": {
                    "js": "console.log('AAAAAAAAAAAAAAAAAAAA');input.n+='A'; input.output.n='A'"
                }
              },
              "channel": "Javascript"
            },
            {
              "config": {
              "type": "javascript",
                "config": {
                    "js": "console.log('AAAAAAAAAAAAAAAAAAAA');input.output.mutated = input.n+'C'"
                }
              },
              "channel": "Javascript"
            },
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
        "objectId": "3Kiu8bXNd6"
      },
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
              "type": "javascript",
              "config": {
                  "js": "console.log('BBBBBBBBBBB');input.n='B';input.output.n+='B'; console.log(JSON.stringify(input.output))"
              }
              },
              "channel": "Javascript"
          },
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
        "objectId": "3Kiu8bXNd6"
      }
     ]))
  }
})


z.test('rule A input mutations should not affect ruleB', async (t) => { 
  var input = {foo:"123",n:'X'}
  await b.run(input)
  t.ok(input.output.mutated = 'XAC','input should be mutatable between actions from same rule')
  t.ok(input.n == 'X', "input.n should be unchanged for next rule")
  t.ok(input.output.n == 'AB', "input.output.n should be unchanged") 
})
