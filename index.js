const issueCommentHandler = require('./lib')

module.exports = robot => {
  robot.on('issue_comment', issueCommentHandler)
  // TODO: Add prCommentHandler
  // robot.on('pull_request.opened', prCommentHandler)
  // robot.on('pull_request.edited', prCommentHandler)
}

exports.issueCommentHandler = issueCommentHandler
