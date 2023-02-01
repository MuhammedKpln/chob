package helpers

import (
	"os/user"
	"path"
)

var VERSION string = "1.0.0"

func ChobPath() string {
	usr, _ := user.Current()
	var Path string = path.Join(usr.HomeDir, ".chob")

	return Path
}

func ApplicationsPath() string {
	usr, _ := user.Current()
	var Path string = path.Join(usr.HomeDir, "Applications")

	return Path
}
