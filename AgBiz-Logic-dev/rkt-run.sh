#!/bin/bash

rkt fetch --pull-policy=update quay.io/seanhammond/agbiz-logic:dev
rkt run --interactive \
        --set-env=AGBIZ_ENV=dev \
        --net=host \
        --hostname=agbizdev.cosine.oregonstate.edu \
        --dns=8.8.8.8 \
        quay.io/seanhammond/agbiz-logic:dev
