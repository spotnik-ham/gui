# gui

Graphical user interface for the spotnik HAM radio/internet relay.

This is the development documentation, for user documentation please refer to the [spotnik documentation]('http://www.spotnik.org').

It consist of Web server providing the necessary APIs and a Web application.
It is written in JavaScript using [Next.js](https://github.com/zeit/next.js).

## Production

### Install

```
ssh spotnik
cd /opt/spotnik
git clone https://github.com/spotnik-ham/gui.git
make
npm start
```

### Update

```
ssh spotnik
cd /opt/spotnik/gui
git pull
make
```

### Run

```
ssh spotnik
cd /opt/spotnik/gui
npm start
```

[https://spotnik](https://spotnik)

## Development

### Install

```
git clone https://github.com/spotnik-ham/gui.git
cd gui
cp config.test.js config.js
make dev
```

### Deploy

Build locally and send files over SSH to the spotnik.

```
make deploy
```
