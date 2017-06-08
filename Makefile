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

restart-remote:
	ssh spotnik '(cd /opt/spotnik/gui; npm run restart) &>/dev/null &'

push:
	next build && make sync

deploy:
	make push
	make restart-remote

test:
	xo

stop:
	pkill --signal SIGINT spotnik || true

start:
	nohup yarn start > spotnik.log 2>&1 &

restart:
	make stop
	make start

clean:
	rm -rf node_modules/
	rm -rf .next/
