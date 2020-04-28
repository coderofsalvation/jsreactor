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
                    "js": `
						_.set( input, 'output.foo.bar', 123 );
					`
                }
              },
              "channel": "Javascript"
            },
            {
              "config": {
              "type": "javascript",
              "config": {
                  "js": "input.output.continued = true"
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


z.test('test non-existing js-function', async (t) => { 
  var input = {foo:"123",n:''}
  await b.run(input)
  t.ok(input.output.foo.bar == 123, "nested value set")
})
