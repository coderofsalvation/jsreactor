> WARNING: this project is in BETA

An flexible rule-engine enhanced with jsonschema for quick userinterface-generation (think IFTTT).
This is basically a wrapper for [json-rules-engine](https://npmjs.com/package/json-rules-engine) enhanced with jsonschemas for user-interaction.

Current backend-adapters:

* [parse-server-jsreactor](https://npmjs.org/package/parse-server-jsreactor) for [Parse-server](https://npmjs.com/package/parse-server)

## Installation

    $ npm install @coderofsalvation/jsreactor --save

```
var BRE = require('jsreactor')

var myBackendAdapter = async (bre) => {
  /* this is optional
   * see [parse-server-jsreactor]() for an adapter-example
   * to persist rules / build schemas from/to a database e.g.
   */
}

var b = BRE(/* myBackendAdapter */ )
var inputChannel = require('@coderofsalvation/jsreactor/channel/Input)
new inputChannel(b)
b.init() // first init
    
b.run({foo:"bar"}) // data will be passed thru the business rules engine
                   // and conditionally triggers actions
```

> jsreactor includes the following [basic channels](channel)

## Installing channels

Search for `jsreactor-channel` on npm, and then install it (e.g. `npm install jsreactor-channel-sendgrid`):

```
// optional: jsreactor's Server-channel is shipped with 
// express-compatible middleware
app.use( require('@coderofsalvation/jsreactor/channel/Server').middleware )

// include
require('glob').sync("node_modules/jsreactor-channel-**/index.js")
.map( (c) => {
    var channel = require( c )
    new channel({bre})
})
```

> Put the above snippet before `bre.init()` and you're done

## DEBUGGING

run `DEBUG=json-rules-engine,bre node app.js` to see more output

## What are Channels?

A channel is basically an object which describes triggers and/or actions.
For example, Twilio (the smsservice) can be seen as a channel with triggers (receive sms) and actions (send sms)

## Creating a channel

copy [channel/HelloWorld/index.js](https://github.com/coderofsalvation/jsreactor/blob/master/channel/HelloWorld/index.js) to `mychannel.js`

then in your cloud-code entrypoint-file (`cloud/index.js` e.g.) add it:

```
    // add the business rule engine + channels
    var BRE         = require('parse-server-business-rule-engine')
    var BREDatabase = require('parse-server-business-rule-engine/channel/Database')
++  var MyChannel   = require('./../mychannel`)
    
    // setup BRE
    var bre = new BRE( Parse )
    new BREDatabase({bre, classes:['User','School']})
++  new MyChannel({bre})
```

## Rerouting logging

Many rules can mean many console.log()-calls in the wild.
In case you want to reroute logging of rules use `initLogger()`:

```
bre.initLogger = (f,rule) => (msg,opts) => {
    // f    = old log function (console.log with a bre prefix)
    // rule = current triggered rule
    // msg  = console.log(msg,... ) passed in a javascript action-block
    // opts = console.log(...,opts) second argument passed to console.log
    console.log(msg,{stream:"rule: "+rule.name})
}
```

## Branching out

Triggers who set an input-array on the output, will automatically be processed in batch
```
input.output.input    = []
input.output.input[0] = {"email":"foo@gmail.com"}
input.output.input[1] = {"email":"foo@gmail.com"}
```
## Environment variables

| name | default | comment | 
|-|-|-|
|JSREACTOR_EDIT_URL | '%id%' | hint edit-links for error-reporting ('http://foo.com/%id%' => 'http://foo.com/l2343kl34'` )
|JSREACTOR_JAVASCRIPT_DOC | https://github.com/coderofsalvation/jsreactor/blob/master/doc/node/javascript.md | displays link to api reference in javascript editor |
    