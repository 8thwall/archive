/* eslint-disable */
export class LCGSeededRandomNumberGenerator {
  constructor(seed) {
    this.m = 4294967296;
    this.a = 1664525;
    this.c = 1013904223;
    this.seed = (seed == null ? Math.random() * this.m : seed) >>> 0;
    this.z = this.seed;
  }

  setSeed(val) {
    this.seed = (val == null ? Math.random() * this.m : val) >>> 0;
    this.z = this.seed;
  }

  getSeed() { 
    return this.seed;
  }

  rand() {
    this.z = (this.a * this.z + this.c) % this.m;
    return this.z / this.m;
  }
}

/**# Perlin Noise 3d
 * ---
 * https://github.com/alterebro/perlin-noise-3d
 */
export class PerlinNoise3d {
  constructor() {
    // Initialize constants and properties
    this.PERLIN_YWRAPB = 4;
    this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
    this.PERLIN_ZWRAPB = 8;
    this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
    this.PERLIN_SIZE = 4095;

    this.SINCOS_PRECISION = 0.5;
    this.SINCOS_LENGTH = Math.floor(360 / this.SINCOS_PRECISION);
    this.cosLUT = new Array(this.SINCOS_LENGTH);
    this.DEG_TO_RAD = Math.PI / 180.0;
    this.perlin_octaves = 4; // default to medium smooth
    this.perlin_amp_falloff = 0.5; // 50% reduction/octave
    this.perlin = null;
    this.perlin_PI = this.SINCOS_LENGTH;

    this.lcg = null;

    // Initialize sine and cosine lookup tables
    this.perlin_PI >>= 1;
    for (let i = 0; i < this.SINCOS_LENGTH; i++) {
      this.cosLUT[i] = Math.cos(i * this.DEG_TO_RAD * this.SINCOS_PRECISION);
    }
  }

  noiseSeed(seed) {
    // Linear Congruential Generator
    // Variant of a Lehman Generator
    const lcg = new LCGSeededRandomNumberGenerator(seed);
    this.lcg = lcg;
    lcg.setSeed(seed);
    this.perlin = new Array(this.PERLIN_SIZE + 1);
    for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
      this.perlin[i] = lcg.rand();
    }
    return this;
  }

  noise_fsc(i) {
    // using cosine lookup table
    return (
      0.5 *
      (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.SINCOS_LENGTH])
    );
  }

  get(x, y = 0, z = 0) {
    if (this.perlin == null) {
      this.perlin = new Array(this.PERLIN_SIZE + 1);
      for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
        this.perlin[i] = Math.random();
      }
    }

    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    if (z < 0) {
      z = -z;
    }

    let xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let rxf, ryf;

    let r = 0;
    let ampl = 0.5;

    let n1, n2, n3;

    for (let o = 0; o < this.perlin_octaves; o++) {
      let of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);

      rxf = this.noise_fsc(xf);
      ryf = this.noise_fsc(yf);

      n1 = this.perlin[of & this.PERLIN_SIZE];
      n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
      n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 +=
        rxf *
        (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      of += this.PERLIN_ZWRAP;
      n2 = this.perlin[of & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n2);
      n3 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n3 +=
        rxf *
        (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += this.noise_fsc(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this.perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  }
}
