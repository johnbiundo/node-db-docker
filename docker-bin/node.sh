#!/bin/sh
echo 'starting node at '
echo $NVM_DIR/versions/node/v$NODE_VERSION/bin
exec node --max-old-space-size=4096 $UNV_ROOT/test.js
echo 'started node-db-docker...'
