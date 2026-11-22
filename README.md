# Tiny Stack VM

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/theyschool/tiny-stack-vm-01-run-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/theyschool/tiny-stack-vm-01-run-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A tiny interpreter for make.fun's stack-machine ISA: 32-bit wrapping integers, a 256-value stack, calls, 256 words of memory, input/output, and ten traps with distinct exit codes.

## Run

    node main.ts

Reads instances from `$MAKEFUN_INPUT_DIR` (default `/input`): for each `<id>` it runs `<id>/program.bin` with `<id>/input.bin`, and writes `$MAKEFUN_OUTPUT_DIR/<id>/stdout.bin` and `<id>/exit.txt` (default output dir `/output`). Requires Node 22+.
