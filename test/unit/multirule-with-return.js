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
                  "js": "console.log('A1');input.n+='A1'; return;"
              }
              },
              "channel": "Javascript"
          },
          {
            "config": {
            "type": "javascript",
            "config": {
                "js": "console.log('A2');input.n+='A2';input.output.A2 =true"
            }
            },
            "channel": "Javascript"
          }
          ],
          "trigger": [
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
                  "js": "console.log('BBBBBBBBBBBBBBBB');input.n+='B'; input.output.executed = true;"
              }
              },
              "channel": "Javascript"
          },
          ],
          "trigger": []
        },
        "objectId": "3Kiu8bXNd6"
      }
     ]))
  }
})


z.test('sync execution', async (t) => { 
  var input = {foo:"123",n:''}
  await b.run(input)
  t.ok(input.output.A2 == undefined, "second action should not be executed")
  t.ok(input.output.executed,'second rule should be executed')
  t.ok(input.n == '', "input.n should not be mutated")
})

/*
z.test('run input through rules engine in parallel', async (t) => { 
    var p = []
    var n = 50
    for( var i =0;i < n;i++)
        p.push( b.run({foo:"123",bar:true,n:''}) )
    var x = await Promise.all(p)
    t.ok( x.length == n,n+" done" ) 
    var sleep = new Promise((r,j)=>setTimeout(r,1000))
    await sleep
})
*/