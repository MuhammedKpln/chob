package modules

import (
	"chobb/helpers"
	"chobb/types"
	"fmt"

	"github.com/blang/semver/v4"
)

func IsUpdated() bool {
	LatestRelease := GetTheLatestRelease("https://github.com/muhammedkpln/chob")

	RELEASED_VERSION, _ := semver.Parse(LatestRelease.TagName)
	CURRENT_VERSION, _ := semver.Parse(helpers.VERSION)

	if RELEASED_VERSION.Major > CURRENT_VERSION.Major {
		return false
	}

	if RELEASED_VERSION.Minor > CURRENT_VERSION.Minor {
		return false
	}

	if RELEASED_VERSION.Patch > CURRENT_VERSION.Patch {
		return false
	}

	return true

}

func UpdateChob() {
	if !IsUpdated() {
		LatestRelease := GetTheLatestRelease("https://github.com/muhammedkpln/chob")

		for i := 0; i < len(LatestRelease.Assets); i++ {
			var Asset types.Asset = LatestRelease.Assets[i]

			if Asset.Name == "chob" {
				helpers.BgInfoMessage("Downloading latest version of chob..")
				Download(Asset.BrowserDownloadURL, "chob")
				helpers.BgSuccessMessage(fmt.Sprintf("Successfully downloaded %s to %s", Asset.Name, helpers.ChobPath()))

			}

		}

	} else {
		helpers.BgSuccessMessage("Yay! You are using the latest version!")
	}
}
