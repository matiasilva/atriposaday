#!/bin/bash

scrap() {
  docker volume rm development_pgdata
  rm -rf migrations
}

build() {(
  set -e
  docker-compose -p development -f docker-compose.yml up -d
  npx sequelize-cli db:migrate
  docker-compose -p development -f docker-compose.yml stop
)}

stop() {
  docker-compose -p development -f docker-compose.yml down
}

stop_() {
  stop >/dev/null 2>&1
}

start() {
  docker-compose -p development -f docker-compose.yml up -d
}

tail() {
  docker-compose -p development -f docker-compose.yml up
}

db() {
    docker exec -i development_db_1 bash
}

help() {
cat <<EOF >&2
Usage: $1 [verb [verb [verb ...]]]

Verbs:
  help     print this help message
  build    build docker image, setup db
  start    run a built image as a daemon
  tail     run a built image with logging to stdout
  stop     stop a daemon
  restart  restart a daemon (= stop start)
  scrap    flush all related docker and db state
  db       open a bash session in the db container
  rebuild  rebuild in case of schema changes (= scrap build)

  up       (= rebuild tail)
  down     (= scrap)

Examples:
  $1 up
    flush all previous docker/db state, prepare a docker image, populate
    a fresh db, and start the image with logs output to stdout
  $1 down
    stop daemon if running and flush all docker/db state
EOF
}

if [[ $# -eq 0 ]]; then
  help "$0"
  exit
fi

for verb in "$@"; do
  case "$verb" in
    scrap) stop_; scrap;;
    start) stop_; start;;
    restart) stop_; start;;
    db) db;;
    stop) stop;;
    tail) stop_; tail;;
    build) stop_; build;;
    rebuild) stop_; scrap; build;;
    up) stop_; scrap; build; tail;;
    down) scrap;;
    help) help "$0"; exit;;
    *) 
      echo "Unrecognised verb: $verb" >&2
      help "$0" >&2
      exit 1;;
  esac
done