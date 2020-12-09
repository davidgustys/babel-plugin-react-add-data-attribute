import babel, { PluginObj } from '@babel/core'
import { JSXIdentifier, File } from 'babel-types'

interface PluginOptions {
  propertyName?: string
  dirLevel?: number
  filename?: string
}

export default ({
  types: t,
}: typeof babel): PluginObj<{
  opts?: Partial<PluginOptions>
  filename: string
  file: File
}> => ({
  name: 'react-data-testid',
  visitor: {
    Program(programPath, state) {
      const propertyName = state.opts?.propertyName
        ? state.opts.propertyName
        : 'data-test'
      const dirLevel = state.opts?.dirLevel ? state.opts.dirLevel : 1

      const slashChar = '/'
      const splits = state.filename.split(slashChar)
      if (!splits || !splits.length) {
        console.error(
          'babel-plugin-add-react-test-attribute plugin error: File path is not valid.'
        )
        return
      }

      const dirNames = splits.slice(-1 - dirLevel, -1)

      const fileName = splits[splits.length - 1].split('.')[0]
      const fileIdentifier = `${dirNames.join('_')}_${fileName}`

      programPath.traverse({
        JSXElement(jsxPath) {
          let nodeName = ''
          let dataIDDefined = false

          // Traverse once to get the element node name (div, Header, span, etc)
          jsxPath.traverse({
            JSXOpeningElement(openingPath) {
              openingPath.stop() // Do not visit child nodes again
              const identifierNode: JSXIdentifier = (openingPath.get('name')
                .node as unknown) as JSXIdentifier

              nodeName = identifierNode.name
              openingPath.traverse({
                JSXAttribute(attributePath) {
                  // If the data attribute doesn't exist, then we append the data attribute
                  const attributeName = attributePath.get('name').node.name
                  if (!dataIDDefined) {
                    dataIDDefined = attributeName === propertyName
                  }
                },
              })
            },
          })

          if (!dataIDDefined && nodeName && nodeName !== 'Fragment') {
            jsxPath.node.openingElement.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier(propertyName),
                t.stringLiteral(`${fileIdentifier}_${nodeName}`)
              )
            )
          }
        },
      })
    },
  },
})
