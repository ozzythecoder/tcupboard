#!/bin/bash

SCRIPT_PID=$(ps -o pgid= $$ | grep -o '[0-9]*')
trap "printf '\nStopping dev processes...'; kill -INT -$SCRIPT_PID; exit" SIGINT

echo "Starting dev process group $SCRIPT_PID"

# All dev processes (add as necessary)
# - Does not include dockerized processes
(pnpm --filter tiptap dev > /dev/null) &
(pnpm --filter slug dev > /dev/null) &

echo "Dev process running."

wait
