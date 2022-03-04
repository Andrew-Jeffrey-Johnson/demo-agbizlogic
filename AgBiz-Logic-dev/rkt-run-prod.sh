#!/bin/bash

rkt fetch --no-store quay.io/seanhammond/agbiz-logic:prod
rkt run --interactive \
        --set-env=AGBIZ_ENV=prod \
        --net=host \
        --hostname=agbizlogic.com \
        --dns=8.8.8.8 \
        quay.io/seanhammond/agbiz-logic:prod
