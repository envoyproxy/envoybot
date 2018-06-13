/* eslint-env jest */

const { issueCommentHandler } = require('../lib')
const { parseAssignees } = require('../util/helpers')

function mockContext () {
  return {
    payload: {
      action: 'action',
      comment: {
        user: {
          login: 'cmluciano'
        },
        body: '/assign @foo @bar'
      },
      issue: { assignees: [] }
    },
    github: {
      issues: {addAssigneesToIssue: jest.fn()}
    },
    issue: (body = {}) => ({ ...body })
  }
}

describe('issueCommentHandler', () => {
  test('assign who are not assigned to be assignees', async () => {
    const context = mockContext()
    await issueCommentHandler(context)

    const { addAssigneesToIssue } = context.github.issues
    expect(addAssigneesToIssue).toHaveBeenCalled()
    expect(addAssigneesToIssue).toHaveBeenCalledWith(
      expect.objectContaining({
        assignees: ['foo', 'bar']
      })
    )
  })

  test('union who are not assigned and already assigned', async () => {
    const context = mockContext()
    context.payload.issue.assignees = [{ login: 'foo' }]
    context.payload.comment.body = '/assign @bar @b-a-z'
    await issueCommentHandler(context)

    const { addAssigneesToIssue } = context.github.issues
    expect(addAssigneesToIssue).toHaveBeenCalled()
    expect(addAssigneesToIssue).toHaveBeenCalledWith(
      expect.objectContaining({
        assignees: ['bar', 'b-a-z', 'foo']
      })
    )
  })

  test('assign unique members', async () => {
    const context = mockContext()
    context.payload.issue.assignees = [{ login: 'foo' }]
    context.payload.comment.body = '/assign @foo @bar'
    await issueCommentHandler(context)

    const { addAssigneesToIssue } = context.github.issues
    expect(addAssigneesToIssue).toHaveBeenCalled()
    expect(addAssigneesToIssue).toHaveBeenCalledWith(
      expect.objectContaining({
        assignees: ['foo', 'bar']
      })
    )
  })
})

describe('parseAssignees', () => {
  const assignees = [{ login: 'foo' }, { login: 'bar' }, { login: 'b-a-z' }]
  const logins = assignees.map(assignee => `${assignee.login}`)

  const body = `the first line
/assign @foo @bar @b-a-z
the second line`

  test('with null body', () => {
    expect(parseAssignees([], null)).toEqual([])
  })

  test('with empty assignees', () => {
    expect(parseAssignees([], body)).toEqual(logins)
  })

  test('with one assignee', () => {
    assignees.forEach(assignee => {
      expect(parseAssignees([assignee], body)).toEqual(logins)
    })
  })

  test('with all assignees', () => {
    expect(parseAssignees(assignees, body)).toEqual(logins)
  })

  test('with empty assignees and empty body', () => {
    expect(parseAssignees([], '')).toEqual([])
  })

  test('with usernames which does not start with @', () => {
    expect(
      parseAssignees([], '/assign @foo @bar please help review thanks')
    ).toEqual(['foo', 'bar'])
  })
})
