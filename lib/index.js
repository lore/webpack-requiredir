/**
 * Use: requireDir(require.context('./actions', true, /\.js$/);
 *
 * @param req: webpack context representing the require statement
 * @return Object
 */
'use strict';

module.exports = function (req, options) {
  options = options || {};
  options.exclude = options.exclude || [];

  var directoryObj = options.objectToModify || {};

  if (req === void 0 || req.keys === void 0) {
    throw new Error('webpack-requireDir requires a webpack context.');
  }

  req.keys().forEach(function (key) {
    var module = req(key);

    // If the module is in the exclude list, skip doing anything with it
    if (options.exclude.indexOf(key) >= 0) {
      return;
    }

    // if applicable, modify the module using the provided function
    if (options.functionToApply) {
      module = options.functionToApply(module);
    }

    // break the key './dir1/dir2/file.js' into ['.', 'dir1', 'dir2', 'file.js']
    var segments = key.split('/');

    // remove the relative path field segment
    segments.splice(0, 1);

    segments.reduce(function (directoryObj, segment) {
      var segmentParts = segment.split('.');
      var name = segmentParts[0];

      // if there's only one segment, like ['dir1'] it's a directory, so make
      // an entry in the object to represent it
      if (segmentParts.length === 1) {
        directoryObj[name] = directoryObj[name] || {};
        return directoryObj[name];
      }

      // if there's more than on segment, like ['file', 'js'] then it's a file, so
      // make an entry in the object and save the module definition to that location
      directoryObj[name] = module;
      return directoryObj;
    }, directoryObj);
  });

  return directoryObj;
};