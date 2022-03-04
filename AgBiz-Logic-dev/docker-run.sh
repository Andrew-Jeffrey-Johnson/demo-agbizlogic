#!/bin/bash

docker run -i -t -h agbizdev.cosine.oregonstate.edu -e AGBIZ_ENV=dev --net=host quay.io/seanhammond/agbiz-logic:dev
