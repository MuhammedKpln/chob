package modules

import (
	"chobb/helpers"
	"chobb/types"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
)

var UserAgent string = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"

func GetTheLatestRelease(RepoUrl string) types.GitHubLatestReleases {
	var SplittedRepo []string = strings.Split(RepoUrl, "/")
	var UserName string = SplittedRepo[3]
	var UserRepo string = SplittedRepo[4]
	RepoUrl = fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", UserName, UserRepo)

	RequestClient := &http.Client{}
	req, _ := http.NewRequest("GET", RepoUrl, nil)
	req.Header.Set("User-Agent", UserAgent)

	resp, err := RequestClient.Do(req)

	if err != nil {
		log.Fatalln("Could not fetch gh latest release", err)
	}

	file, _ := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	var GithubLatestRelease types.GitHubLatestReleases
	json.Unmarshal(file, &GithubLatestRelease)

	return GithubLatestRelease
}

func Download(DownloadUrl string, FileName string) {
	RequestClient := &http.Client{}
	req, _ := http.NewRequest("GET", DownloadUrl, nil)
	req.Header.Set("User-Agent", UserAgent)

	resp, err := RequestClient.Do(req)

	if err != nil {
		log.Fatalln("Could not download", FileName)
		helpers.BgDangerMessage("Could not download")
		return
	}

	var File string = path.Join(helpers.ChobPath(), FileName)
	out, err := os.Create(File)
	defer out.Close()

	io.Copy(out, resp.Body)
	err = os.Chmod(File, 0777)

	if err != nil {
		log.Fatalln("Could not set 777 chmod!")
		return
	}
	// exec.Command("chmod +x %s", File).Start()
	defer resp.Body.Close()
}
