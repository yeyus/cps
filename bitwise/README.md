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
npx tsx bitwise/. generate src/configs/radios/quansheng-uvk5.memmap
```