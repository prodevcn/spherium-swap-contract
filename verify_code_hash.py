#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re
from web3 import Web3


def compute_init_hash():
    """Computes the init hash when compiled with the truffle suit"""

    file_ = "build/contracts/UniswapV2Pair.json"
    with open(file_, "r") as f:
        raw_data = f.read()

    json_data = json.loads(raw_data)

    h = Web3.keccak(hexstr=json_data["bytecode"])
    h = h.hex()
    print("Computed hex code '{}' from '{}' bytecode".format(h, file_))

    return h


def find_init_hash():
    """Finds the current used code hash"""

    file_ = "contracts/libraries/UniswapV2Library.sol"
    with open(file_, "r") as f:
        data = f.read()

    # Note: we are looking for this line of code
    # "                hex'a3043439c27aa76c987e8ae89f4e9cd49407760d87b873eac90e14beb75f66ee' // init code hash"
    pattern = "hex'([0-9A-Fa-f]{64})'"

    m = re.search(pattern, data)
    assert(len(m.groups()) > 0)

    h = m.groups()[0]
    h = "0x" + h
    print("Found hex code '{}' in '{}'".format(h, file_))

    return h


if __name__ == "__main__":
    h1 = compute_init_hash()
    h2 = find_init_hash()
    if h1.lower() != h2.lower():
        print("WARNING: init hash codes do NOT MATCH. Make sure to update 'UniswapV2Library.sol' before deploying to a non-local network!")
        print("Replace {} -> {}".format(h1, h2))

