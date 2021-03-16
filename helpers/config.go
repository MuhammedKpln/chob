package helpers

import (
	"os/user"
	"path"
)

var VERSION string = "1.0.0"

func ChobPath() string {
	usr, _ := user.Current()
	var Path string = path.Join(usr.HomeDir, "Documents", "chobb")

	return Path
}
