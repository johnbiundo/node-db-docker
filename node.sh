#!/bin/sh
exec /usr/bin/node /test/test.js >>/var/log/test.log 2>&1
