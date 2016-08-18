#!/bin/bash

SCRIPTNAME="executePipelines"

cd "`dirname \"$0\"`"
cd ../bin

log() {
  logger $1
  echo $1
}

PID_NODE=`ps ax | grep $SCRIPTNAME.js | grep -v grep | awk '{ print $1 }' | tr '\n' ' '`
if [[ -n "$PID_NODE" ]]
then
  log "Killing $SCRIPTNAME.js"
  kill -9 $PID_NODE
  sleep 2
fi

log "Starting $SCRIPTNAME.js"

./$SCRIPTNAME
