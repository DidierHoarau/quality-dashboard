#!/bin/sh

# Set BASEPATH
if [ "${BASEPATH}" = "" ]; then
    BASEPATH=/
fi
echo "BASEPATH: ${BASEPATH}"
BASEPATH_ESC=$(echo ${BASEPATH} | sed 's/\//\\\//g')
find /usr/share/nginx/html -type f | grep -v \.ico | xargs sed -i "s/\/quality-dashboard\//${BASEPATH_ESC}/g"

# Start NGINX
nginx -g 'daemon off;'
