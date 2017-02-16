#!/bin/bash
cd "${BASH_SOURCE%/*}" || exit
php ./console cache:clear -e prod
rm -rf ./../src/AppBundle/Resources/assets/assetic/*
php ./console assetic:dump -e prod
gulp
