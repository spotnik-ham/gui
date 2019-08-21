# gui

Graphical user interface for the spotnik HAM radio/internet relay.

This is the development documentation, for user documentation please refer to the [spotnik documentation](http://spotnik.org/index.php?id=spotnik).

It consist of Web server providing the necessary APIs and a Web application.
It is written in JavaScript using [Next.js](https://github.com/zeit/next.js).

`npm` and `Node.js` >= 10 are required.

For debian:

```sh
apt update && apt install nodejs npm
```

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
