let { chain, concat, startsWith } = require('lodash')

function usernameReducer (acc, line) {
  if (!startsWith(line, '/assign')) {
    return acc
  }

  let usernames = line
    .replace(/^\/assign\s+/, '')
    .trim()
    .split(/\s+/)
    .filter(login => login.startsWith('@'))
    .map(username => username.replace(/^@/, ''))

  return concat(acc, usernames)
}

function parseAssignees (assignees, body = '') {
  if (!body) {
    // body might be null
    return []
  }

  let lines = body.split(/\n/).map(line => line.trim())

  return chain(lines)
    .reduce(usernameReducer, [])
    .union(assignees.map(assignee => `${assignee.login}`))
    .uniq()
    .value()
}

exports.parseAssignees = parseAssignees
