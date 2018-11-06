use("github.com/repokitteh/modules/assign.star")
use("github.com/repokitteh/modules/review.star")
use("github.com/repokitteh/modules/kitteh.star")
use("github.com/repokitteh/modules/doge.star")
use("github.com/repokitteh/modules/wait.star")

def on_issue_comment():
  github_issue_create_comment('y')
