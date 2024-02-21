# Parser for Bitwise grammar

## Generate typescript types

```
npx ohm generateBundles --withTypes bitwise/bitwise.ohm
```

## Print AST for bitwise memmap

```
npx tsx bitwise/. printast src/configs/radios/quansheng-uvk5.memmap
```

## Generate TS mappings for bitwise memmap

```
Usage: tsx bitwise/. generate <class name prefix> <path to memmap>

npx tsx bitwise/. generate BaofengUV5R src/configs/radios/baofeng-uv5r.memmap  > baofeng-uv5r.ts && npx eslint --config .eslintrc --fix baofeng-uv5r.ts
```