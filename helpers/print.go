package helpers

import (
	"github.com/fatih/color"
)

func BgDangerMessage(m ...interface{}) {
	var TextOptions color.Color = *color.New(color.BgRed, color.Bold)
	TextOptions.Println(m...)
	color.Unset()
}

func BgInfoMessage(m ...interface{}) {
	var TextOptions color.Color = *color.New(color.FgBlue, color.Bold)
	TextOptions.Println(m...)
	color.Unset()
}

func BgSuccessMessage(m ...interface{}) {
	var TextOptions color.Color = *color.New(color.FgGreen, color.Bold)
	TextOptions.Println(m...)
	color.Unset()
}
