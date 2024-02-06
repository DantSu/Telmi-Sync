const
  COMMON_KEY = Buffer.from([0x91, 0xbd, 0x7a, 0x0a, 0xa7, 0x54, 0x40, 0xa9, 0xbb, 0xd4, 0x9d, 0x6c, 0xe0, 0xdc, 0xc0, 0xe3]),
  DELTA = -1640531527,

  LITTLE_ENDIAN = true,
  BIG_ENDIAN = false,

  /**
   * @param buffer {Buffer}
   * @param minSize {int}
   * @returns {Buffer}
   */
  cipher = (buffer, minSize) => {
    const
      block = Buffer.from(buffer).subarray(0, Math.min(minSize, buffer.length)),
      dataInt = toIntArray(block, LITTLE_ENDIAN),
      keyInt = toIntArray(COMMON_KEY, BIG_ENDIAN),
      decryptedInt = btea(dataInt, keyInt)
    return toByteArray(decryptedInt)
  },

  /**
   *
   * @param buffer {Buffer}
   * @param endianness {boolean}
   * @returns {Uint32Array}
   */
  toIntArray = (buffer, endianness) => {
    const ints = new Uint32Array(buffer.length / 4)
    for (let i = 0; i < buffer.length; i += 4) {
      ints[i / 4] = endianness === LITTLE_ENDIAN ? buffer.readInt32LE(i) : buffer.readInt32BE(i)
    }
    return ints
  },

  /**
   * @param ints {Uint32Array}
   * @returns {Buffer}
   */
  toByteArray = (ints) => {
    const buffer = Buffer.alloc(ints.length * 4)
    for (let i = 0; i < ints.length; ++i) {
      buffer.writeUInt32LE(ints[i], i * 4)
    }
    return buffer
  },

  /**
   * @param v {Uint32Array}
   * @param k {Uint32Array}
   * @returns {Uint32Array}
   */
  btea = (v, k) => {
    const n = v.length
    let y, sum, rounds
    rounds = 1 + Math.floor(52 / n)
    sum = rounds * DELTA
    y = v[0]
    do {
      const e = (sum >>> 2) & 3
      let p
      for (p = n - 1; p > 0; --p) {
        v[p] -= mx(k, e, p, y, v[p - 1], sum)
        y = v[p]
      }
      v[0] -= mx(k, e, p, y, v[n - 1], sum)
      y = v[0]
      sum -= DELTA
    } while (--rounds !== 0)

    return v
  },

  /**
   *
   * @param k {Uint32Array}
   * @param e {int}
   * @param p {int}
   * @param y {int}
   * @param z {int}
   * @param sum {int}
   * @returns {int}
   */
  mx = (k, e, p, y, z, sum) => {
    return ((((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^ ((sum ^ y) + (k[(p & 3) ^ e] ^ z)))
  },

  /**
   * @param buffer {Buffer}
   * @returns {Buffer}
   */
  decipherXXTEA = (buffer) => {
    const decipherBlock = cipher(buffer, 512)
    return buffer.length > 512 ? Buffer.concat([decipherBlock, Buffer.from(buffer).subarray(512)]) : decipherBlock
  }

export { decipherXXTEA }
