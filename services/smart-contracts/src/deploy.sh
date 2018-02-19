#!/bin/sh

#----------------------------------------------------------------------------->
# This script exists so that we can save all output in the specified log file >
#----------------------------------------------------------------------------->

# deploy contracts
truffle migrate --reset --all | tee -a $LOG_FILE
