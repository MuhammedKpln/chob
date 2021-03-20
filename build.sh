echo "Building chob..."

echo "Removing old  builds.."
rm -rf chob-linux chob-freebsd chob-openbsd

echo "Building for Linux.."
GOOS=linux GOARCH=amd64 go build
mv chobb chob-linux
echo "Building for FreeBSD.."
GOOS=freebsd GOARCH=amd64 go build
mv chobb chob-freebsd
echo "Building for OpenBSD.."
GOOS=openbsd GOARCH=amd64 go build
mv chobb chob-openbsd