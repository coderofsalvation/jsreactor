# Javascript node

This node has only actions.

## ACTION: javascript

Write custom (chainable) javascript (actions):

```
var wait = () => new Promise( (r,j) => setTimeout(r,1000) )
await wait()
```

> NOTE: the sandbox does not include global objects like `process` and so on. Extra global variables can be exposed using the BRE option object.

### Halting execution

sometimes you may want to `return` to halt further execution:

```
if( userHasNoPermissions() ) return
```

This is especially handy, when chaining multiple actions inside a rule.
Actions further in the chain won't be executed anymore.