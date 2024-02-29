#!/usr/bin/env bash
readonly pathDevice=$1
readonly mountPart=$(df "$pathDevice" | tail -1 | awk '{ print $1 }')
umount -l "$pathDevice"
udisksctl power-off -b "$mountPart" --no-user-interaction
