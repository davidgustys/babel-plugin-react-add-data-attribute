import pluginTester from 'babel-plugin-tester'
import path from 'path'
import plugin from '.'

pluginTester({
  plugin,
  babelOptions: { parserOpts: { plugins: ['jsx'] } },
  snapshot: true,
  tests: [
    {
      title: 'Functional Component',
      fixture: path.join(__dirname, '__fixtures__', 'functionComponent.tsx'),
    },
    {
      title: 'Arrow Function Component',
      fixture: path.join(__dirname, '__fixtures__', 'arrowFunction.tsx'),
    },
  ],
})
