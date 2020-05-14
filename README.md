# journal

A quick CLI journal (For markdown)

## Installation

```
npm install -g jrnl-js
```

## Usage

Set your journal file with `jrnl set [name]`. After that, you can write updates
with `jrnl [name]`. To end writing, press `Ctrl + X`. jrnl will add date
timestamps every day, without any automated separation between entries in the
same day.

Note that an empty `[name]` is considered as a valid value, so a main journal
can be accessed with only `jrnl`
