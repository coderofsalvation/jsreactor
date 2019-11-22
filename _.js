// lodash bare minimum
var _ = {

    get: function get(xs,x,fallback) {
        return String(x).split('.').reduce(function(acc, x) {
            if (acc == null || acc == undefined ) return fallback;
            return new Function("x","acc","return acc['" + x.split(".").join("']['") +"']" )(x, acc) || fallback
        }, xs)
    },
    set: function set(obj, path, value) {
	  var last
	  var o = obj
	  path = String(path)
	  var vars = path.split(".")
	  var lastVar = vars[vars.length - 1]
	  vars.map(function(v) {
	      if (lastVar == v) return
	      o = (new Function("o","return o." + v)(o) || new Function("o","return o."+v+" = {}")(o))
	      last = v
	  })
	  new Function("o","v","o." + lastVar + " = v")(o, value)
    },    
    pluck: function pluck(arr,obj){
        var o = {}
        arr.map( (l) => o[l] = _.get(obj,l) )
        return o
    },
    omit: function omit(arr,obj) {
        var o = JSON.parse(JSON.stringify(obj))
        arr.map((l) => delete o[l])
        return o;
    },
    mapToObject: function(map){
        return Array.from(map).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    }
    
}

module.exports = _
