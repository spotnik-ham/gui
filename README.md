# gui Version 5

## Cette version est en cours de développement. Aucune garantie quant à son fonctionnement.

Graphical user interface for the spotnik HAM radio/internet relay.

This is the development documentation, for user documentation please refer to the [spotnik documentation](http://spotnik.org/index.php?id=spotnik).

It consist of Web server providing the necessary APIs and a Web application.
It is written in JavaScript using [Next.js](https://github.com/zeit/next.js).

`npm` and `Node.js` >= 14 are required.

For debian:

```sh
apt update && apt install nodejs npm
```

## Production

### Install

```
ssh spotnik
cd /opt/spotnik
git clone --single-branch --branch Version_5 https://github.com/spotnik-ham/gui.git
cd gui
make
make start
```

### Update

```
ssh spotnik
cd /opt/spotnik/gui
git pull https://github.com/spotnik-ham/gui.git
make stop
make
make start
```

### Run

```
ssh spotnik
cd /opt/spotnik/gui
make start
```

[https://spotnik](https://spotnik)

## Development

```
# a faire sur le spotnik
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

cat /root/.ssh/id_rsa.pub 
rajouté a clef sur le site github
https://github.com/settings/ssh/new

git config --global user.email "you@example.com"
git config --global user.name "Your Name"

git clone git@github.com:spotnik-ham/gui.git
cd gui

faire les modifs
tester !
make stop
make
make start

si c'est ok

git add .
git commit -m "description"
git push

```
### Deploy

Build locally and send files over SSH to the spotnik.

```
make deploy

```
