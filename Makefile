PATH := node_modules/.bin:$(PATH)

.PHONY: setup test clean

setup:
	rm -f package-lock.json
	npm install
	next build

build:
	next build
	
dev:
	npm install
	node server.js

sync:
	rsync -r --exclude spotnik --exclude node_modules --exclude .git . spotnik:/opt/spotnik/gui
	ssh spotnik '(cd /opt/spotnik/gui; cp config.example.js config.js)'
	ssh spotnik '(cd /opt/spotnik/gui; cp config.js .next/dist)'

push:
	next build
	make sync
	ssh spotnik '(cd /opt/spotnik/gui; npm install)'

deploy:
	make push
	ssh spotnik '(cd /opt/spotnik/gui; make restart)'

test:
	xo

stop:
	pkill --signal SIGINT "Spotnik Gui" || true
	pkill --signal SIGINT spotnik || true

start:
	nohup npm start > /tmp/spotnik.log 2>&1 &

restart:
	make stop
	make start

clean:
	rm -rf node_modules/
	rm -rf .next/
