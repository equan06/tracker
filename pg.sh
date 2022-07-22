#!/bin/bash
sudo service postgresql start

node src/api/server.js
