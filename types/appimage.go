package types

type AppImage struct {
	Version     int    "json:version"
	HomePageUrl string "json:home_page_url"
	Description string "json:description"
	Icon        string "json:icon"
	Favicon     string "json:favicon"
	Expired     bool   "json:expired"
	Items       []Item
}

type Item struct {
	Name        string "json:name"
	Description string "json:description"
	Categories  []string
	Icons       []string
	Screenshots []string
	Authors     []Author
	Links       []Link
}

type Author struct {
	Name string "json:name"
	Url  string "json:url"
}

type Link struct {
	Type string "json:type"
	Url  string "json:type"
}
