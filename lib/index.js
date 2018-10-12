const { parseAssignees } = require('../util/helpers')

async function issueCommentHandler (context) {
  const { github, payload, log } = context
  const user = payload.comment.user.login
  const body = payload.comment.body
  const assignees = payload.issue.assignees

  let newAssignees = parseAssignees(assignees, body)
  let assigneeList = newAssignees.join(', ')

  let isCollaborator = true
  try {
    await github.repos.checkCollaborator(context.repo({ username: assigneeList }))
  } catch (e) {
    if (e.code === 404) isCollaborator = false  // Will throw if status code is 404
  }

  if (!isCollaborator) {
    let commentBody = 'Issues cannot be assigned to collaborators that are not envoyproxy organization members'
    return github.issues.createComment(context.issue({body: commentBody}))
  }
  // TODO: log assigned users
  // context.log(`Assigning [${assigneeList}] to issue.`)
  await github.issues.addAssigneesToIssue(context.issue({ assignees: newAssignees }))
}

exports.issueCommentHandler = issueCommentHandler
