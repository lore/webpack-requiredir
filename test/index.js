const requireDir = require('../src/index');
const expect = require('chai').expect;

const MockRequireContext = function(keys, requireFunc) {
  const result = (path) => {
    return requireFunc(path);
  };
  result.keys = () => keys;
  return result;
};


describe('MockRequireContext', () => {
  describe('given a new mock context', () => {
    const args = ['./foo.js'];
    const mockContext = new MockRequireContext(args, (arg) => 'mock result: ' + arg);

    it('will contain a keys method that returns the args passed in', () => {
      expect(mockContext.keys()).to.deep.eq(args);
    });

    it('when calling the context with a string', () => {
      expect(mockContext('./foo.js')).to.eq('mock result: ./foo.js');
    });
  });
});

describe('requireDir', () => {
  describe('when given no webpack context', () => {
    it('it will throw an error', () => {
      expect(requireDir).to.throw('webpack-requireDir requires a webpack context.');
    });
  });

  describe('when given a webpack context', () => {
    const args = [
      './foo.js',
      './foo2/bar.js'
    ];
    const mockContext = new MockRequireContext(args, (arg) => '' + arg);

    describe('by default', () => {
      it('it will return a nested object of the required directories', () => {
        expect(requireDir(mockContext)).to.deep.eq({
          foo: './foo.js',
          foo2: {
            bar: './foo2/bar.js'
          }
        });
      });
    });

    describe('given an object to modify', () => {
      it('it will append the results to the object', () => {
        expect(requireDir(mockContext, {
          objectToModify: {
            biz: './baz.js'
          }
        })).to.deep.eq({
          foo: './foo.js',
          foo2: {
            bar: './foo2/bar.js'
          },
          biz: './baz.js'
        });
      });
    });

    describe('when given an exclude list', () => {
      it('it will exclude files in the list from the result', () => {
        expect(requireDir(mockContext, {
          exclude: [
            './foo2/bar.js'
          ]
        })).to.deep.eq({
          foo: './foo.js'
        });
      });
    });

    describe('when given a function to apply', () => {
      it('it will apply that function to each module before returning', () => {
        expect(requireDir(mockContext, {
          functionToApply: (module) => {
            return `->` + module;
          }
        })).to.deep.eq({
          foo: '->./foo.js',
          foo2: {
            bar: '->./foo2/bar.js'
          }
        });
      });
    });
  });
});
