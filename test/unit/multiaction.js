var z = require('zora')
var _ = require('./../../_')
var jre   = require('json-rules-engine')
var b /*BRE engine instance*/
var BRE = require('./../../BRE')
var HelloWorld  = require('./../../channel/HelloWorld')
var Input       = require('./../../channel/Input')
var Javascript  = require('./../../channel/Javascript')

z.test('init BRE',  async (t) => {
  b = new BRE() // index.js
  b.engine = new jre.Engine()
  new HelloWorld({bre:b})
  new Input({bre:b})
  new Javascript({bre:b})
  t.ok(true,"inited")
})

z.test('loadRuleConfigs', async (t) => {
    
  b.loadRuleConfigs = () => {
     return new Promise( (resolve, reject) => resolve([
        {
            "config":{
                "basic": {
                "name": "invite teacher to group",
                "notes": "",
                "disabled": false,
                "language": "ALL",
                "priority": 1000,
                "triggered": 0,
                "formschema": "{\n  \"type\": \"object\",\n  \"required\":[\"action\",\"email\",\"groupId\"],\n  \"properties\": {\n    \"action\": {\n      \"type\": \"string\",\n      \"pattern\": \"^inviteTeacher\",\n      \"required\": true,\n      \"default\":\"inviteTeacher\"\n    },\n    \"firstName\":{\n      \"description\":\"teacher firstname\",\n      \"type\":\"string\"\n    },\n    \"lastName\":{\n      \"description\":\"teacher lastname\",\n      \"type\":\"string\"\n    },\n    \"email\": {\n      \"description\":\"teacher email\",\n      \"type\": \"string\",\n      \"pattern\":\".*@.*\"\n    },\n    \"groupId\":{\n      \"type\":\"string\"\n    },\n    \"fromFirstName\":{\n      \"description\":\"user firstname\",\n      \"type\":\"string\"\n    },\n    \"fromLastName\":{\n      \"description\":\"user lastname\",\n      \"type\":\"string\"\n    }\n  }\n}"
                },
                "action": [
                {
                    "config": {
                    "type": "javascript",
                    "config": {
                        "js": "input.output.debug = true; input.i+=1;input.password = String(Math.ceil(Math.random()*50000));\ninput.username = input.email.split(\"@\")[0] + '_' + \n               Math.random().toString(36).substr(2, 5);\nconsole.log(\"1\");\n // pass to next action"
                    }
                    },
                    "channel": "Javascript"
                },
                {
                    "config": {
                    "type": "javascript",
                    "config": {
                        "js": "input.i+=1;console.log(2);console.log(JSON.stringify(cfg,null,2));"
                    }
                    },
                    "channel": "Javascript"
                },
                {
                    "config": {
                    "type": "javascript",
                    "config": {
                        "js": "var w = new Promise((r,j)=>setTimeout(r,500)); await w; input.i+=1;console.log(3)"
                    }
                    },
                    "channel": "Javascript"
                }
                ],
                "trigger": [
                {
                    "config": {
                    "type": "inputValidateSchema",
                    "config": {
                        "schema": "{\n  \"type\": \"object\",\n  \"required\":[\"action\",\"email\",\"groupId\"],\n  \"properties\": {\n    \"action\": {\n      \"type\": \"string\",\n      \"pattern\": \"^inviteTeacher\",\n      \"required\": true\n    },\n    \"firstName\":{\n      \"type\":\"string\"\n    },\n    \"lastName\":{\n      \"type\":\"string\"\n    },\n    \"fromFirstName\":{\n      \"type\":\"string\"\n    },\n    \"fromLastName\":{\n      \"type\":\"string\"\n    },\n    \"email\": {\n      \"type\": \"string\",\n      \"pattern\":\".*@.*\"\n    },\n    \"groupId\":{\n      \"type\":\"string\"\n    }\n  }\n}"
                    }
                    },
                    "channel": "Input"
                }
                ]
            }
          }
     ]))
  }
})

z.test('run input', async (t) => {
    var input = {
        i:0,
        "action": "inviteTeacher",
        "firstName": "leon",
        "lastName": "van Kammen",
        "email": "pennateacher50@harakirimail.com",
        "groupId": "234243",
        "fromFirstName": "Hans",
        "fromLastName": "de Flopper"
    } 
    var result = await b.run(input)
    t.ok( result.runid && result.triggers && result.actions && result.output,"result obj ok" )
    t.ok( result.input.i == 3 && result.input.password && result.input.username, "modified input was forwarded" )
})


