export type rgb = {
  r: number;
  g: number;
  b: number;
};

export type okLch = {
  L: number;
  c: number;
  h: number;
};

export type okLab = {
  L: number;
  a: number;
  b: number;
};

// const M1 = [
//   [0.8189330101, 0.3618667424, -0.1288597137],
//   [0.0329845436, 0.9293118715, 0.0361456387],
//   [0.0482003018, 0.2643662691, 0.633851707],
// ]

const M2 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
];

const Mrgb = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

// const iM1 = [
//   [1.2270138511, -0.5577999806, 0.2812561489],
//   [-0.0405801784, 1.1122568696, -0.0716766786],
//   [-0.0763812845, -0.4214819784, 1.5861632204],
// ]

const iM2 = [
  [0.9999999984, 0.3963377921, 0.215803758],
  [1.0000000088, -0.1055613423, -0.0638541747],
  [1.0000000546, -0.089484182, -1.2914855378],
];

const iMrgb = [
  [4.0767416613, -3.3077115904, 0.2309699287],
  [-1.268438004, 2.6097574006, -0.3413193963],
  [-0.0041960865, -0.7034186144, 1.7076147009],
];

export function oklab_to_rgb({ L, a, b }: { L: number; a: number; b: number }) {
  let l = iM2[0][0] * L + iM2[0][1] * a + iM2[0][2] * b;
  let m = iM2[1][0] * L + iM2[1][1] * a + iM2[1][2] * b;
  let s = iM2[2][0] * L + iM2[2][1] * a + iM2[2][2] * b;

  l = l * l * l;
  m = m * m * m;
  s = s * s * s;

  return {
    r: iMrgb[0][0] * l + iMrgb[0][1] * m + iMrgb[0][2] * s,
    g: iMrgb[1][0] * l + iMrgb[1][1] * m + iMrgb[1][2] * s,
    b: iMrgb[2][0] * l + iMrgb[2][1] * m + iMrgb[2][2] * s,
  };
}

export function rgb_to_oklab({ r, g, b }: { r: number; g: number; b: number }) {
  let l = Mrgb[0][0] * r + Mrgb[0][1] * g + Mrgb[0][2] * b;
  let m = Mrgb[1][0] * r + Mrgb[1][1] * g + Mrgb[1][2] * b;
  let s = Mrgb[2][0] * r + Mrgb[2][1] * g + Mrgb[2][2] * b;

  l = Math.pow(l, 1 / 3);
  m = Math.pow(m, 1 / 3);
  s = Math.pow(s, 1 / 3);

  let lab = { L: 0, a: 0, b: 0 };

  lab.L = M2[0][0] * l + M2[0][1] * m + M2[0][2] * s;
  lab.a = M2[1][0] * l + M2[1][1] * m + M2[1][2] * s;
  lab.b = M2[2][0] * l + M2[2][1] * m + M2[2][2] * s;

  return lab;
}

export function oklch_to_oklab({ L, c, h }: okLch) {
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  return { L, a, b };
}

export function oklab_to_oklch({ L, a, b }: okLab) {
  const c = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a); // Returns hue in radians
  return { L, c, h };
}

export function hex_to_rgb(hx: string) {
  hx = hx.replace(/^#/, '');

  // Parse the hex string into red, green, and blue components
  const r = parseInt(hx.substring(0, 2), 16) / 255;
  const g = parseInt(hx.substring(2, 4), 16) / 255;
  const b = parseInt(hx.substring(4, 6), 16) / 255;

  return { r, g, b };
}

export function rgb_to_hex({ r, g, b }: rgb) {
  const to_hex = (val: number) => {
    let hex = Math.round(val * 255);
    if (hex < 0) hex = 0;
    if (hex > 255) hex = 255;
    const st = hex.toString(16);
    return st.length === 1 ? `0${st}` : st;
  };

  const hexR = to_hex(r);
  const hexG = to_hex(g);
  const hexB = to_hex(b);

  return `#${hexR}${hexG}${hexB}`;
}

export function color_step(beg: okLch, end: okLch, step: number) {
  // handle when chroma is small
  if (beg.c < 0.001) {
    beg.h = end.h;
  }
  if (end.c < 0.001) {
    end.h = beg.h;
  }

  let delta_h = end.h - beg.h;
  if (delta_h > 0.5) {
    delta_h -= 1;
  } else if (delta_h < -0.5) {
    delta_h += 1;
  }

  step = step - 1;
  let delta = {
    L: (end.L - beg.L) / step,
    c: (end.c - beg.c) / step,
    h: delta_h / step,
  };

  let arr: okLch[] = [];
  for (let i = 0; i <= step; ++i) {
    let val = {
      L: beg.L + i * delta.L,
      c: beg.c + i * delta.c,
      h: beg.h + i * delta.h,
    };
    // Ensure the hue stays within [0, 1) range
    val.h = ((val.h % 1) + 1) % 1;
    arr.push(val);
  }
  console.log(arr);

  return arr;
}
