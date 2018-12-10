const template = require("@babel/template")

module.exports = function({ types: t }) {
  return {
    visitor: {
      ForOfStatement(path, state) {
      	if (path.node.left.type === 'VariableDeclaration' &&
            path.node.left.leadingComments.length > 0 &&
            path.node.left.leadingComments[0].value.includes('ngen')
        ) {
            const indexID = path.scope.generateUidIdentifier('')
            const indexName = indexID.name
            const entityName = path.node.left.declarations[0].id.name
            path.get('body').unshiftContainer('body', template.statement.ast(`const ${entityName} = new Entity_(${indexName})`))
            path.replaceWith(
              t.forStatement(
                t.variableDeclaration('let', 
                  [t.variableDeclarator(indexID, t.numericLiteral(0))]
                ),
                template.expression.ast`${indexName} < entities.length`,
                template.expression.ast`++${indexName}`,
                path.node.body
              )
            )
	}
      },
    }
  }
}
