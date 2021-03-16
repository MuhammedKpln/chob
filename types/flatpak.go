package types

type Flatpak []FlatpakElement

type FlatpakElement struct {
	FlatpakAppID          string  `json:"flatpakAppId"`
	Name                  string  `json:"name"`
	Summary               string  `json:"summary"`
	CurrentReleaseVersion *string `json:"currentReleaseVersion"`
	CurrentReleaseDate    string  `json:"currentReleaseDate"`
	IconDesktopURL        *string `json:"iconDesktopUrl"`
	IconMobileURL         *string `json:"iconMobileUrl"`
	InStoreSinceDate      *string `json:"inStoreSinceDate"`
}
