package main

import (
	"chobb/helpers"
	"chobb/modules"
	"flag"
	"fmt"
	"log"
	"os"
	"path"

	"github.com/fatih/color"
)

func main() {
	Command := flag.NewFlagSet(flag.Arg(0), flag.ExitOnError)
	Cache := Command.Bool("enableCache", false, "Enables the cache")
	CacheDisabled := Command.Bool("disableCache", false, "Disables the cache")
	flag.Parse()
	Arg := flag.Arg(0)

	if Arg != "" {
		Command.Parse(os.Args[2:])
	}

	if *CacheDisabled {
		modules.RemoveCache()

		return
	}

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

	LogInit()

	go modules.FetchApplications(Cache)
	modules.SearchForApplication(Arg)
}

func LogInit() {

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
}
