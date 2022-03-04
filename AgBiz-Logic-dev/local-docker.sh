#!/bin/sh

# Run container with local source mounted
docker run -it --env AGBIZ_ENV=local --net=host -v $PWD:/app quay.io/seanhammond/agbiz-logic:dev