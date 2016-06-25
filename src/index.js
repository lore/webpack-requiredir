/**
 * Use: requireDir(require.context('./actions', true, /\.js$/);
 *
 * @param req: webpack context representing the require statement
 * @param options: options
 * @return Object
 */
module.exports = (req, options = {}) => {
  options.exclude = options.exclude || [];

  const directoryObj = options.objectToModify || {};

  if (req === void 0 || req.keys === void 0) {
    throw new Error('webpack-requireDir requires a webpack context.');
  }

  req.keys().forEach((key) => {
    let module = req(key);

    // Babel hack, required to get ES5 and ES6 to place nice together
    // by extracting the module from .default per Babel 6 behavior
    if (module.default && module.__esModule) {
      module = module.default;
    }

    // If the module is in the exclude list, skip doing anything with it
    if (options.exclude.indexOf(key) >= 0) {
      return;
    }

    // if applicable, modify the module using the provided function
    if (options.functionToApply) {
      module = options.functionToApply(module);
    }

    // break the key './dir1/dir2/file.js' into ['.', 'dir1', 'dir2', 'file.js']
    const segments = key.split('/');

    // remove the relative path field segment
    segments.splice(0, 1);

    segments.reduce((result, segment) => {
      const segmentParts = segment.split('.');
      const name = segmentParts[0];

      // if there's only one segment, like ['dir1'] it's a directory, so make
      // an entry in the object to represent it
      if (segmentParts.length === 1) {
        result[name] = result[name] || {};
        return result[name];
      }

      // if there's more than on segment, like ['file', 'js'] then it's a file, so
      // make an entry in the object and save the module definition to that location
      result[name] = module;
      return result;
    }, directoryObj);
  });

  return directoryObj;
};
