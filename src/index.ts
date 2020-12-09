import babel, { NodePath, PluginObj } from '@babel/core'
import * as t from 'babel-types'

interface IPluginOptions {
  propertyName?: string
  dirLevel?: number
  filename?: string
}

type FunctionType =
  | t.FunctionDeclaration
  | t.FunctionExpression
  | t.ArrowFunctionExpression

function nameForReactComponent(
  path: NodePath<FunctionType>
): t.Identifier | null {
  const { parentPath } = path

  if (!t.isArrowFunctionExpression(path.node) && t.isIdentifier(path.node.id)) {
    return path.node.id
  }
  if (t.isVariableDeclarator(parentPath)) {
    // @ts-ignore
    return parentPath.node.id
  }

  return null
}

interface IState {
  opts?: Partial<IPluginOptions>
  filename: string
  file: t.File
}

export default function plugin({
  types: t,
}: typeof babel): PluginObj<IState> {
  return {
    name: 'babel-plugin-react-add-data-attribute',
    visitor: {
      Function(programPath, state) {
        const propertyName = state.opts?.propertyName
          ? state.opts.propertyName
          : 'data-test'
        const dirLevel = state.opts?.dirLevel ? state.opts.dirLevel : 1

        const identifier = nameForReactComponent(
          (programPath as unknown) as NodePath<FunctionType>
        )
        if (!identifier) {
          return
        }

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
        const fileIdentifier = `${dirNames.join('_')}_${fileName}_${identifier.name
          }`

        const prevLiterals: { [key: string]: number } = {}
        programPath.traverse({
          JSXElement(jsxPath) {
            let nodeName = ''
            let dataIDDefined = false

            // Traverse once to get the element node name (div, Header, span, etc)
            jsxPath.traverse({
              JSXOpeningElement(openingPath) {
                openingPath.stop() // Do not visit child nodes again
                const identifierNode: t.JSXIdentifier = (openingPath.get('name')
                  .node as unknown) as t.JSXIdentifier

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
              if (
                typeof prevLiterals[`${fileIdentifier}_${nodeName}`] ===
                'undefined'
              ) {
                prevLiterals[`${fileIdentifier}_${nodeName}`] = 0
              } else {
                prevLiterals[`${fileIdentifier}_${nodeName}`] += 1
              }
              const siblingIter = prevLiterals[`${fileIdentifier}_${nodeName}`]

              jsxPath.node.openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(propertyName),
                  t.stringLiteral(
                    `${fileIdentifier}_${nodeName}${siblingIter > 0 ? '_' + siblingIter : ''
                    }`
                  )
                )
              )
            }
          },
        })
      },
    },
  }
}
