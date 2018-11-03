use("github.com/softkitteh/repokitteh-modules/assign.star")
use("github.com/softkitteh/repokitteh-modules/review.star")
use("github.com/softkitteh/repokitteh-modules/kitteh.star")
use("github.com/softkitteh/repokitteh-modules/doge.star")
use("github.com/softkitteh/repokitteh-modules/wait.star")

def _ping():
  github_issue_create_comment('pong')
  
command(name='ping', func=_ping)
