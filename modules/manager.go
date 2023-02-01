package modules

import (
	"chobb/helpers"
	"chobb/types"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/fatih/color"
)

var AppImages = make(chan types.AppImage)
var Snaps = make(chan types.Snap)
var Flatpaks = make(chan types.Flatpak)
var Applications []types.BaseApplication
var CacheEnabled *bool

func FetchApplications(PackageName string, cache *bool) {
	CacheEnabled = cache
	if *CacheEnabled || CachesExists() {

		AppImageCache := LoadCache(types.AppImageType)
		FlatpakCache := LoadCache(types.FlatpakType)
		SnapCache := LoadCache(types.SnapType)

		var AppImagesApps types.AppImage
		json.Unmarshal(AppImageCache, &AppImagesApps)

		var FlatpakApps types.Flatpak
		json.Unmarshal(FlatpakCache, &FlatpakApps)

		var SnapApps types.Snap
		json.Unmarshal(SnapCache, &SnapApps)

		AppImages <- AppImagesApps
		Flatpaks <- FlatpakApps
		Snaps <- SnapApps

		return

	} else {
		helpers.BgInfoMessage("⚡ Complaining about slow search results? Try caching results by adding --enableCache argument at the end of your command!")
	}

	helpers.BgInfoMessage("Fetching applications..")
	go FetchAppImages()
	go FetchFlatpaks()
	go FetchSnaps()


}

func FetchFlatpaks() {
	var FetchUrl string = "https://flathub.org/api/v1/apps"
	resp, err := http.Get(FetchUrl)

	if err != nil {
		log.Fatalln("Could not fetch flatpak url", FetchUrl)
	}

	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)

	var apps types.Flatpak
	json.Unmarshal(data, &apps)
	
	Flatpaks <- apps
	if *CacheEnabled {
		CreateCache(".flathub.json", data, CacheEnabled)
	}
	defer close(Flatpaks)

}

func FetchSnaps() {
	var FetchUrl string = "https://raw.githubusercontent.com/MuhammedKpln/chob/master/snapcraft.json"

	resp, err := http.Get(FetchUrl)

	if err != nil {
		log.Fatalln("Could not fetch snap url", FetchUrl)
	}

	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)

	var apps types.Snap
	json.Unmarshal(data, &apps)

	Snaps <- apps
	if *CacheEnabled {
		CreateCache(".snap.json", data, CacheEnabled)
	}
	defer close(Snaps)

}

func FetchAppImages() {
	var FetchUrl string = "https://appimage.github.io/feed.json"

	resp, err := http.Get(FetchUrl)

	if err != nil {
		log.Fatalln("Could not fetch appimage url", FetchUrl)
	}

	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)

	var apps types.AppImage
	json.Unmarshal(data, &apps)



	AppImages <- apps
	
	if *CacheEnabled {
		CreateCache(".appimage.json", data, CacheEnabled)
	}
	defer close(AppImages)

}

func CombineResults(PackageName string) {
	SearchInsideAppImages(PackageName)
	SearchInsideFlatpaks(PackageName)
	SearchInsideSnaps(PackageName)
}

func SearchForApplication(PackageName string) {

	if len(Applications) < 1 {
		helpers.BgDangerMessage(fmt.Sprintf("Could not find any application: %s", PackageName))

		return
	}

	helpers.BgSuccessMessage(fmt.Sprintf("Found %s application!", strconv.Itoa(len(Applications))))
	for i := 0; i < len(Applications); i++ {
		var app types.BaseApplication = Applications[i]
		color.New(color.BgBlue, color.Bold).Printf("%s) %s - %s \n", strconv.Itoa(i), app.Name, string(app.Type))
	}
	helpers.BgSuccessMessage("Please select an application: ")
	var SelectedAppIndex int
	fmt.Scan(&SelectedAppIndex)

	if SelectedAppIndex > len(Applications) {
		helpers.BgDangerMessage(fmt.Sprintf("Please select numbers between 0-%s", strconv.Itoa(len(Applications))))

		return
	}

	var SelectedApp types.BaseApplication = Applications[SelectedAppIndex]

	if SelectedApp.Type == types.AppImageType {
		helpers.BgInfoMessage("Do you want to install AppImage automatically? [Y/n] ")

		var InstallAppImage string

		fmt.Scanln(&InstallAppImage)

		if strings.ToLower(InstallAppImage) == "y" {
			if SelectedApp.RepoUrl != "" {
				DownloadAppImage(SelectedApp.RepoUrl, SelectedApp.Name)

				return
			} else {
				helpers.BgDangerMessage("Could not found any download links..")
			}

		}

	}

	helpers.BgSuccessMessage(fmt.Sprintf("Opening %s", SelectedApp.Name))

	exec.Command("xdg-open", SelectedApp.Url).Start()

}

func SearchInsideAppImages(PackageName string) {
	_AppImages := <-AppImages

	for i := 0; i < len(_AppImages.Items); i++ {
		App := _AppImages.Items[i]

		RemotePackageName := strings.ToLower(App.Name)
		PackageName := strings.ToLower(PackageName)
		var RepoUrl string
		if strings.Contains(RemotePackageName, PackageName) {

			if len(App.Links) > 0 {
				RepoUrl = App.Links[1].Url
			}

			app := types.BaseApplication{
				Name:    App.Name,
				Url:     "https://appimage.github.io/" + App.Name,
				Type:    types.AppImageType,
				RepoUrl: RepoUrl,
			}

			Applications = append(Applications, app)
		}
	}
}

func SearchInsideSnaps(PackageName string) {
	_Snaps := <-Snaps

	for i := 0; i < len(_Snaps.Embedded.ClickindexPackage); i++ {
		App := _Snaps.Embedded.ClickindexPackage[i]

		RemotePackageName := strings.ToLower(App.Name)
		PackageName := strings.ToLower(PackageName)

		if strings.Contains(RemotePackageName, PackageName) {
			var URL string = fmt.Sprintf("https://snapcraft.io/%s", App.PackageName)
			app := types.BaseApplication{
				Name: App.Name,
				Url:  URL,
				Type: types.SnapType,
			}

			Applications = append(Applications, app)
		}
	}
}
func SearchInsideFlatpaks(PackageName string) {
	_Flatpaks := <-Flatpaks

	for i := 0; i < len(_Flatpaks); i++ {
		App := _Flatpaks[i]

		RemotePackageName := strings.ToLower(App.Name)
		PackageName := strings.ToLower(PackageName)

		if strings.Contains(RemotePackageName, PackageName) {
			var URL string = fmt.Sprintf("https://flathub.org/apps/details/%s", App.FlatpakAppID)
			app := types.BaseApplication{
				Name: App.Name,
				Url:  URL,
				Type: types.FlatpakType,
			}

			Applications = append(Applications, app)
		}
	}
}

func DownloadAppImage(RepoUrl string, AppName string) {
	LatestRelease := GetTheLatestRelease(RepoUrl)
	LatestReleaseAssets := LatestRelease.Assets
	var DownloadUrl string
	var ApplicationFolderExists = CheckIfApplicationsFolderExists()


	if !ApplicationFolderExists {
		CreateApplicationsFolder()
	}

	if len(LatestReleaseAssets) > 0 {
		helpers.BgInfoMessage("Found latest release, trying to download..")
	}

	for i := 0; i < len(LatestReleaseAssets); i++ {
		if strings.HasSuffix(LatestReleaseAssets[i].Name, ".appimage") || strings.HasSuffix(LatestReleaseAssets[i].Name, ".AppImage") {

			DownloadUrl = LatestReleaseAssets[i].BrowserDownloadURL
		}
	}

	Download(DownloadUrl, AppName+".AppImage")

	helpers.BgSuccessMessage(fmt.Sprintf("Successfully downloaded %s to %s", AppName, helpers.ApplicationsPath()))
}


func  CheckIfApplicationsFolderExists() bool {
	stat, err := os.Stat(helpers.ApplicationsPath());
	
	if err == nil  && stat.IsDir() {
		if os.IsNotExist(err) {
			return false
		} 


		return true
	}

	return false
}

func  CreateApplicationsFolder()  {
    if err := os.Mkdir(helpers.ApplicationsPath(), os.ModePerm); err != nil {
        log.Fatal(err)
    }
}