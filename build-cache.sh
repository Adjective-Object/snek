#!/usr/bin/env bash

if [ $# -lt 2 ]; then
    echo "usage: $0 <path-to-repo> <path-to-cache> [path-to-store]";
    exit 1;
fi

set -e
if [ $# == 3 ]; then export NIX_STORE_DIR=$3; fi

pkgnames=$(nix-env -qaP -f $1/default.nix | cut -d ' '  -f 1)

function nix-lookup () {
    EXPR="\"\${(import $1 {}).$2}\""
    nix-instantiate --eval -E "${EXPR}" | sed 's:"::g'
    return 0
}

for pkg in $pkgnames; do

    # echo '└┘┌┐─│'
    size=${#pkg} 
    echo -en "\e[34m┌"
    printf '─%.0s' {1..78}
    echo -e "┐\e[0m";

    echo -en "\e[34m│"
    echo -en " $pkg"
    linesize=$(expr 77 - $size)
    printf " %.0s" $(eval "echo -en {1.."$(($linesize))"}" )
    echo -e "│\e[0m";

    echo -en "\e[34m└"
    printf '─%.0s' {1..78}
    echo -e "┘\e[0m";

    nix-lookup $1/default.nix $pkg;
    path="$(nix-lookup $1/default.nix "$pkg")";
    nix-push $path --dest cache;
done

