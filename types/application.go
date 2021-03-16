package types

type Type string

const (
	AppImageType Type = "AppImage"
	FlatpakType  Type = "Flathub"
	SnapType     Type = "Snapcraft"
)

type BaseApplication struct {
	Name    string ""
	Url     string ""
	Type    Type
	RepoUrl string
}
