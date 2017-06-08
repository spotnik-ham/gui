# gui

Graphical user interface for the spotnik HAM radio/internet relay.

This is the development documentation, for user documentation please refer to the spotnik documentation.

It consist of Web server providing the necessary APIs and a Web application.
It is written in JavaScript using [https://github.com/zeit/next.js](next.js).

## Production

### Install

```
ssh spotnik
cd /opt/spotnik
git clone https://github.com/spotnik-ham/gui.git
cp config.example.js config.js
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

[http://spotnik](http://spotnik)

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
