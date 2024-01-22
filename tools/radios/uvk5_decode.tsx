const XOR_KEY = new Uint8Array([
  0x16, 0x6c, 0x14, 0xe6, 0x2e, 0x91, 0x0d, 0x40, 0x21, 0x35, 0xd5, 0x40, 0x13, 0x03, 0xe9, 0x80,
]);

const xor = (data) => {
  const dataCopy = new Uint8Array(data);
  dataCopy.forEach((_, index, array) => (array[index] ^= XOR_KEY[index % XOR_KEY.length]));
  return dataCopy;
};

// Packages are formed as https://github.com/sq5bpf/uvk5-reverse-engineering/blob/main/sample_read.txt
function decode(input) {
  const tokens = input.split(" ");

  const out = new Uint8Array(tokens.length);
  tokens.forEach((token, index) => (out[index] = parseInt(token, 16)));

  return xor(out);
}

module.exports = {
  xor,
  decode,
};
