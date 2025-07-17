#!/usr/bin/env bash
readonly pathDevice=$1
sync $pathDevice
umount -l "$pathDevice"
exit 0
