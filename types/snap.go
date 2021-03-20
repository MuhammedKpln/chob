package types

type Snap struct {
	Embedded Embedded `json:"_embedded"`
}

type Embedded struct {
	ClickindexPackage []ClickindexPackage `json:"clickindex:package"`
}

type ClickindexPackage struct {
	Aliases             []Alias             `json:"aliases"`
	AnonDownloadURL     string              `json:"anon_download_url"`
	Apps                []string            `json:"apps"`
	Architecture        []Architecture      `json:"architecture"`
	BinaryFilesize      int64               `json:"binary_filesize"`
	Channel             Channel             `json:"channel"`
	CommonIDS           []string            `json:"common_ids"`
	Confinement         Confinement         `json:"confinement"`
	Contact             string              `json:"contact"`
	Content             Content             `json:"content"`
	DatePublished       string              `json:"date_published"`
	Deltas              []interface{}       `json:"deltas"`
	Description         string              `json:"description"`
	DeveloperID         string              `json:"developer_id"`
	DeveloperName       string              `json:"developer_name"`
	DeveloperValidation DeveloperValidation `json:"developer_validation"`
	DownloadSha3384     string              `json:"download_sha3_384"`
	DownloadSha512      string              `json:"download_sha512"`
	DownloadURL         string              `json:"download_url"`
	Epoch               string              `json:"epoch"`
	GatedSnapIDS        []string            `json:"gated_snap_ids"`
	IconURL             string              `json:"icon_url"`
	LastUpdated         string              `json:"last_updated"`
	License             string              `json:"license"`
	Name                string              `json:"name"`
	Origin              string              `json:"origin"`
	PackageName         string              `json:"package_name"`
	Prices              Prices              `json:"prices"`
	Private             bool                `json:"private"`
	Publisher           string              `json:"publisher"`
	RatingsAverage      int64               `json:"ratings_average"`
	Release             []string            `json:"release"`
	Revision            int64               `json:"revision"`
	ScreenshotUrls      []string            `json:"screenshot_urls"`
	SnapID              string              `json:"snap_id"`
	Summary             string              `json:"summary"`
	SupportURL          string              `json:"support_url"`
	Title               string              `json:"title"`
	Version             string              `json:"version"`
	Website             *string             `json:"website"`
	Base                *BaseEnum           `json:"base,omitempty"`
}

type Alias struct {
	Name   string `json:"name"`
	Target string `json:"target"`
}

type Prices struct {
	Usd *float64 `json:"USD,omitempty"`
}

type Architecture string

const (
	All   Architecture = "all"
	Amd64 Architecture = "amd64"
	Arm64 Architecture = "arm64"
	Armhf Architecture = "armhf"
	I386  Architecture = "i386"
)

type BaseEnum string

const (
	Core18            BaseEnum = "core18"
	Empty             BaseEnum = ""
	Fedora29          BaseEnum = "fedora29"
	TestSnapdBaseBare BaseEnum = "test-snapd-base-bare"
)

type Channel string

const (
	Stable Channel = "stable"
)

type Confinement string

const (
	Classic Confinement = "classic"
	Strict  Confinement = "strict"
)

type Content string

const (
	Application Content = "application"
	Base        Content = "base"
	Gadget      Content = "gadget"
	Kernel      Content = "kernel"
	OS          Content = "os"
)

type DeveloperValidation string

const (
	Unproven DeveloperValidation = "unproven"
	Verified DeveloperValidation = "verified"
)
