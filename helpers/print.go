package helpers

import (
	"github.com/fatih/color"
)

func BgDangerMessage(m ...interface{}) {
	var TextOptions color.Color = *color.New(color.BgRed, color.FgHiWhite, color.Bold)
	TextOptions.Println(m...)
	color.Unset()
}

func BgInfoMessage(m ...interface{}) {
	var TextOptions color.Color = *color.New(color.BgBlue, color.FgHiWhite, color.Bold)
	TextOptions.Println(m...)
	color.Unset()
}

func BgSuccessMessage(m ...interface{}) {
	var TextOptions color.Color = *color.New(color.BgGreen, color.FgHiWhite, color.Bold)
	TextOptions.Println(m...)
	color.Unset()
}
