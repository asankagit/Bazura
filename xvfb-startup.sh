#!/bin/bash

Xvfb :99 -ac -screen 0 "$XVFB_RES" -nolisten tcp $XVFB_ARGS &
XVFB_PROC=$!
sleep 1
export DISPLAY=:99
"$@"
kill $XVFB_PROC

# docker run -it --name my-running-app my-x11-app node server.js -p 8080:8080 