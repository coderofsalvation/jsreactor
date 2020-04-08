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
                    "js": "input.output.str = input.output.str || ''; input.output.str += '0'+input.v"
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
                  "js": "input.output.str = input.output.str || ''; input.output.str += '1'+input.v"
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
  var output = {}
  var input = {
    '0':{v:'A',output},
    '1':{v:'B',output},
    foo:123,
  }
  await b.run(input)
  console.dir(input)
  t.ok(output.str == '0A0B1A1B', "input-array should be processed per element" )
})
