#!/bin/bash
set -e

read -p "input use env name:" userEnvName

envName=${userEnvName:-"default"}

rm -f -r ./config/
cp -R ./configThemes/"${envName}"/ ./config/

echo -e ${envName} "setup!"