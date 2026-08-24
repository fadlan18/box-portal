#!/bin/bash
MSG=${1:-"update: $(date '+%Y-%m-%d %H:%M')"}
cd /home/authserv/box-portal
git add -A
git commit -m "$MSG"
git push origin master
echo "✓ box-portal saved: $MSG"
