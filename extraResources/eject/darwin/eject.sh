#!/bin/sh
mountPart=$(df "$1" | tail -1 | awk '{ print $1 }')
diskutil unmount "$mountPart"
