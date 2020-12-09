#!/bin/bash
# ./0_new_channel.sh
# ./c0_deploy_ehs_smartcontract.sh
echo "My first parameter is $1"
../scripts/Org1_new_channel.sh $1
../scripts/Org1_deploy_ehs_smartcontract.sh $1