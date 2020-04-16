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
                    "js": `console.log("ja");return;
                    var user   = await Parse.Object.get(input.user.objectId)
                    
                    return; // *TODO* fix this rule
                    
                    var school = 
                    var Group  = input.request.object
                    
                    // find out if its the only (and therefore first group)
                    // and current user is onboard == 'teacher'
                    if( user.get('onBoard') == 'teacher' && school.Groups.length == 1 ){
                      // send out email
                    
                    }else return; // dont send`
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
  input.n+='B'
  t.ok(input.n == 'B', "should be sync")
  t.ok( !input.output.continued, "second action should not execute" )
})
