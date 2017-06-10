PATH := node_modules/.bin:$(PATH)

.PHONY: setup test clean

setup:
	yarn
	next build

dev:
	yarn
	node server.js

sync:
	rsync -r --exclude config.js --exclude spotnik --exclude node_modules --exclude .git . spotnik:/opt/spotnik/gui
	ssh spotnik '(cd /opt/spotnik/gui; cp config.js .next/dist)'

push:
	next build
	make sync
	ssh spotnik '(cd /opt/spotnik/gui; yarn)'

deploy:
	make push
	ssh spotnik '(cd /opt/spotnik/gui; make restart)'

test:
	xo

stop:
	pkill --signal SIGINT spotnik || true

start:
	nohup yarn start > /tmp/spotnik.log 2>&1 &

restart:
	make stop
	make start

clean:
	rm -rf node_modules/
	rm -rf .next/
