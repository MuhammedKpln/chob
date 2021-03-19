package main

import (
	"chobb/helpers"
	"chobb/modules"
	"flag"
	"fmt"
	"log"
	"os"
	"path"
	"strings"

	"github.com/fatih/color"
)

func main() {
	Cache := flag.Bool("enableCache", false, "enableCache")
	flag.Parse()
	Arg := flag.Arg(0)

	if Arg == "check" {
		if !modules.IsUpdated() {
			helpers.BgInfoMessage("There is a new version for chob! To download it use chob update")
		} else {
			helpers.BgSuccessMessage("Yay! You are using the latest version!")
		}

		return
	}
	if Arg == "update" {
		modules.UpdateChob()

		return
	}

	if Arg == "" {
		fmt.Println(color.RedString("I need a package name!"))

		return
	}

	AskForRemoveOlderVersion()

	var LogFile string = path.Join(helpers.ChobPath(), "chob.log")

	_, err := os.ReadDir(helpers.ChobPath())

	if err != nil {
		os.Mkdir(helpers.ChobPath(), 0777)
	}

	f, err := os.OpenFile(LogFile, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)

	go modules.FetchApplications(Cache)
	modules.SearchForApplication(Arg)
}

func AskForRemoveOlderVersion() {
	helpers.BgInfoMessage("Did u use Chob before? [y/n] ")
	var IsUsed string
	fmt.Scanln(&IsUsed)

	if strings.ToLower(IsUsed) == "y" {
		helpers.BgDangerMessage(fmt.Sprintf("Please remove your old Chob folder, located at: %s", helpers.ChobPath()))
		os.Exit(0)
	}

}
