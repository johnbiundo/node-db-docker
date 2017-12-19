#!/bin/bash
set -e					# exit immediately if a command exits with a non-zero status

if [[ -z "${TEST_DB_HOST}" ]]; then
	echo >&2 '[ERROR]: specify a TEST_DB_HOST environment variable'
	exit 1
fi

if [[ -z "${TEST_DB_NAME}" ]]; then
	echo >&2 '[ERROR]: specify a TEST_DB_HOST environment variable'
	exit 1
fi

#
