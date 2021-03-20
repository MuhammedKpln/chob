package modules

import (
	"chobb/helpers"
	"chobb/types"
	"encoding/json"
	"log"
	"os"
	"path"
	"strconv"
)

func CreateCache(FileName string, Data []byte, ForceCreate *bool) {
	var File string = path.Join(helpers.ChobPath(), FileName)

	log.Println("Writing cache: ", FileName)
	if _, err := os.Stat(File); os.IsNotExist(err) || *ForceCreate {
		var v interface{}
		json.Unmarshal(Data, &v)
		json, _ := json.Marshal(v)

		os.WriteFile(File, json, 0644)

	}
}

func CacheIsExist(CacheType types.Type) bool {
	var File string = path.Join(helpers.ChobPath())

	switch CacheType {
	case types.AppImageType:
		File = path.Join(File, ".appimage.json")
	case types.FlatpakType:
		File = path.Join(File, ".flathub.json")
	case types.SnapType:
		File = path.Join(File, ".snap.json")
	}

	_, err := os.Stat(File)
	log.Printf("Check cache of %s: %s", File, err)

	if err == nil {
		return true

	}

	return false
}

func CachesExists() bool {
	var AppImageCache bool = CacheIsExist(types.AppImageType)
	var SnapCache bool = CacheIsExist(types.SnapType)
	var FlatpakCache bool = CacheIsExist(types.FlatpakType)

	log.Printf("Check all caches, Appimage: %s, Snap: %s, flatpak: %s", strconv.FormatBool(AppImageCache), strconv.FormatBool(SnapCache), strconv.FormatBool(FlatpakCache))

	if AppImageCache && SnapCache && FlatpakCache {
		return true
	}

	return false

}

func LoadCache(CacheType types.Type) []byte {
	var File string = path.Join(helpers.ChobPath())

	switch CacheType {
	case types.AppImageType:
		File = path.Join(File, ".appimage.json")

	case types.FlatpakType:
		File = path.Join(File, ".flathub.json")
	case types.SnapType:
		File = path.Join(File, ".snap.json")
	}

	file, err := os.ReadFile(File)

	if err != nil {
		log.Printf("Loading cache of %s", File)
		log.Fatalln(err)
	}

	return file

}

func RemoveCache() {
	os.RemoveAll(path.Join(helpers.ChobPath()))
}
