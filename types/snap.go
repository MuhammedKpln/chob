package types
type Snap struct {
	Embedded Embedded `json:"_embedded"`
}

type Embedded struct {
	ClickindexPackage []ClickindexPackage `json:"clickindex:package"`
}

type ClickindexPackage struct {
	Aliases     []Alias  `json:"aliases"`
	Apps        []string `json:"apps"`
	PackageName string   `json:"package_name"`
	Summary     string   `json:"summary"`
	Title       string   `json:"title"`
	Version     string   `json:"version"`
}

type Alias struct {
	Name   string `json:"name"`
	Target string `json:"target"`
}