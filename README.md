webpack-requireDir
===
Recursively require a modules based on a webpack require context.

##Usage:

```
const requireDir = require('webpack-requireDir');
const result = requireDir(require.context('./src/actions', true, /\.js$/))

# result will be a hash containing modules by name.
```

##Options:

```
objectToModify - if given then results will be appended to this object
```

```
exclude - array of modules names.  if in this list they are excluded from the require.
```

```
functionToApply - if provided a function that will be ran on every module included.
```

