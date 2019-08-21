# gui

Graphical user interface for the spotnik HAM radio/internet relay.

This is the development documentation, for user documentation please refer to the [spotnik documentation]('http://www.spotnik.org').

It consist of Web server providing the necessary APIs and a Web application.
It is written in JavaScript using [Next.js](https://github.com/zeit/next.js).

in needed nodejs and yarn  : on debian 
curl -sS https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo "deb http://deb.nodesource.com/node_8.x jessie main" | tee /etc/apt/sources.list.d/nodesource.list

curl -sS http://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - 
echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

then 
apt-get update && apt-get install yarn nodejs



## Production

### Install

```
ssh spotnik
cd /opt/spotnik
git clone https://github.com/spotnik-ham/gui.git
cd gui
make
make start
```

### Update

```
ssh spotnik
cd /opt/spotnik/gui
git pull https://github.com/spotnik-ham/gui.git
make
```

### Run

```
ssh spotnik
cd /opt/spotnik/gui
make start
```

[https://spotnik](https://spotnik)

## Development

### Install

```
git clone https://github.com/spotnik-ham/gui.git
cd gui
make dev
```

### Deploy

Build locally and send files over SSH to the spotnik.

```
make deploy
```
# test modif #
# avec Sonny #