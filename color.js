const M1 = [
    [ .8189330101,  .3618667424,- .1288597137],
    [ .0329845436,  .9293118715,  .0361456387],
    [ .0482003018,  .2643662691,  .6338517070]
];

const M2 = [
    [ .2104542553,  .7936177850,- .0040720468],
    [1.9779984951,-2.4285922050,  .4505937099],
    [ .0259040371,  .7827717662,- .8086757660]
];

const Mrgb = [
    [ .4122214708, .5363325363, .0514459929],
    [ .2119034982, .6806995451, .1073969566],
    [ .0883024619, .2817188376, .6299787005],
];

const iM1 = [
    [ 1.2270138511, - .5577999806,   .2812561489 ],
    [- .0405801784,  1.1122568696, - .0716766786 ],
    [- .0763812845, - .4214819784,  1.5861632204 ],
];

const iM2 = [
    [ 0.9999999984,   .3963377921,   .2158037580],
    [ 1.0000000088, - .1055613423, - .0638541747],
    [ 1.0000000546, - .0894841820, -1.2914855378]
];

const iMrgb = [
    [  4.0767416613, -3.3077115904,   .2309699287, ],
    [ -1.2684380040,  2.6097574006, - .3413193963, ],
    [ - .0041960865, - .7034186144,  1.7076147009, ]
];

/**
    * @param {Object} param0
    * @param {number} param0.x
    * @param {number} param0.y
    * @param {number} param0.z
*/
function xyz_to_oklab({x, y, z}){
    console.log(x, y, z)
    let l = M1[0][0] * x + M1[0][1] * y + M1[0][2] * z;
    let m = M1[1][0] * x + M1[1][1] * y + M1[1][2] * z;
    let s = M1[2][0] * x + M1[2][1] * y + M1[2][2] * z;

    l = Math.cbrt(l);
    m = Math.cbrt(m);
    s = Math.cbrt(s);
    console.log(l, m, s)

    let lab = {L: 0, a: 0, b: 0};

    lab.L = M2[0][0] * l + M2[0][1] * m + M2[0][2] * s;
    lab.a = M2[1][0] * l + M2[1][1] * m + M2[1][2] * s;
    lab.b = M2[2][0] * l + M2[2][1] * m + M2[2][2] * s;

    return lab;
}

/**
    * @param {Object} param0
    * @param {number} param0.L
    * @param {number} param0.a
    * @param {number} param0.b
*/
function oklab_to_xyz({L, a, b}){
    let lms = {l: 0, m: 0, s: 0};

    lms.l = iM2[0][0] * L + iM2[0][1] * a + iM2[0][2] * b;
    lms.m = iM2[1][0] * L + iM2[1][1] * a + iM2[1][2] * b;
    lms.s = iM2[2][0] * L + iM2[2][1] * a + iM2[2][2] * b;

    let xyz = {x: 0, y: 0, z: 0};

    xyz.x = iM1[0][0] * (lms.l ** 3) + iM1[0][1] * (lms.m ** 3) + iM1[0][2] * (lms.s ** 3);
    xyz.y = iM1[1][0] * (lms.l ** 3) + iM1[1][1] * (lms.m ** 3) + iM1[1][2] * (lms.s ** 3);
    xyz.z = iM1[2][0] * (lms.l ** 3) + iM1[2][1] * (lms.m ** 3) + iM1[2][2] * (lms.s ** 3);

    return xyz;
}

/**
    * @param {Object} param0
    * @param {number} param0.x
    * @param {number} param0.y
    * @param {number} param0.z
*/
function xyz_to_rgb({x, y, z}){
    let r = iMrgb[0][0] * x + iMrgb[0][1] * y + iMrgb[0][2] * z;
    let g = iMrgb[1][0] * x + iMrgb[1][1] * y + iMrgb[1][2] * z;
    let b = iMrgb[2][0] * x + iMrgb[2][1] * y + iMrgb[2][2] * z;

    return {r, g, b};
}

/**
    * @param {Object} param0
    * @param {number} param0.r
    * @param {number} param0.g
    * @param {number} param0.b
*/
function rgb_to_xyz({r, g, b}){
    console.log(r, g, b)
    let x = Mrgb[0][0] * r + Mrgb[0][1] * g + Mrgb[0][2] * b;
    let y = Mrgb[1][0] * r + Mrgb[1][1] * g + Mrgb[1][2] * b;
    let z = Mrgb[2][0] * r + Mrgb[2][1] * g + Mrgb[2][2] * b;

    return {x, y, z};
}

/**
    * @param {Object} param0
    * @param {number} param0.L
    * @param {number} param0.a
    * @param {number} param0.b
*/
function oklab_to_rgb({L, a, b}){
    let xyz = oklab_to_xyz({L, a, b});
    return xyz_to_rgb(xyz);
}

/**
    * @param {Object} param0
    * @param {number} param0.r
    * @param {number} param0.g
    * @param {number} param0.b
*/
function rgb_to_oklab({r, g, b}){
    let l = Mrgb[0][0] * r + Mrgb[0][1] * g + Mrgb[0][2] * b;
    let m = Mrgb[1][0] * r + Mrgb[1][1] * g + Mrgb[1][2] * b;
    let s = Mrgb[2][0] * r + Mrgb[2][1] * g + Mrgb[2][2] * b;
    console.log(l, m, s)

    let lab = {L: 0, a: 0, b: 0};

    lab.L = M2[0][0] * l + M2[0][1] * m + M2[0][2] * s;
    lab.a = M2[1][0] * l + M2[1][1] * m + M2[1][2] * s;
    lab.b = M2[2][0] * l + M2[2][1] * m + M2[2][2] * s;

    return lab;
}
/**
    * @param {Object} param0
    * @param {number} param0.L
    * @param {number} param0.c
    * @param {number} param0.h
*/
function oklch_to_oklab({ L, c, h }) {
    const a = c * Math.cos(h);
    const b = c * Math.sin(h);
    return { L, a, b };
}

/**
    * @param {Object} param0
    * @param {number} param0.L
    * @param {number} param0.a
    * @param {number} param0.b
*/
function oklab_to_oklch({ L, a, b }) {
    const c = Math.sqrt(a * a + b * b);
    const h = Math.atan2(b, a); // Returns hue in radians
    return { L, c, h };
}


/**
    * @param {string} hx
*/
function hex_to_rgb(hx) {
    hx = hx.replace(/^#/, '');

    // Parse the hex string into red, green, and blue components
    const r = parseInt(hx.substring(0, 2), 16) / 255;
    const g = parseInt(hx.substring(2, 4), 16) / 255;
    const b = parseInt(hx.substring(4, 6), 16) / 255;

    return { r, g, b };
}

/**
    * @param {Object} param0
    * @param {number} param0.r
    * @param {number} param0.g
    * @param {number} param0.b
*/
function rgb_to_hex({ r, g, b }) {
    const to_hex = (value) => {
        const hex = Math.min( Math.round(value * 255)).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    };

    const hexR = to_hex(r);
    const hexG = to_hex(g);
    const hexB = to_hex(b);

    return `#${hexR}${hexG}${hexB}`;
}


/**
    * @param {Object} beg
    * @param {number} beg.r
    * @param {number} beg.g
    * @param {number} beg.b
    * @param {Object} end
    * @param {number} end.r
    * @param {number} end.g
    * @param {number} end.b
    * @param {number} step
*/
function color_step(beg, end, step, hue_extra = 0){
    step = step - 1;
    let beglch = oklab_to_oklch(rgb_to_oklab(beg));
    let endlch = oklab_to_oklch(rgb_to_oklab(end));

    let h = endlch.h - beglch.h;

    let delta = {
        L: (endlch.L - beglch.L) / step,
        c: (endlch.c - beglch.c) / step,
        h: h / step,
    }


    let arr = [];
    for(let i = 0; i <= step; ++i){
        let val = {
            L: beglch.L + i * delta.L,
            c: beglch.c + i * delta.c,
            h: beglch.h + i * delta.h,
        }
        console.log(val)
        arr.push(oklab_to_rgb(oklch_to_oklab(val)));
    }

    return arr;
}

function render_steps(){
    /** @type HTMLDivElement */
    let col_e = document.getElementById('color');
    if(col_e == null){
        return;
    }
    let beg = hex_to_rgb( col_e.children['color-beg'].value );
    let end = hex_to_rgb( col_e.children['color-end'].value );
    let step = parseInt(col_e.children['color-step'].value);
    let extra = parseInt(col_e.children['color-extra'].value) / 100.;
    console.log("steps: ", step);
    console.log("extra: ", extra);
    /** @type HTMLDivElement */
    let steps = col_e.children['steps'];
    steps.innerHTML = "";

    let colors = color_step(beg, end, step, extra);
    colors.forEach((color, idx) => {
        let element = document.createElement('div');
        let color_hex = rgb_to_hex(color);
        element.id = `color-${idx}`;
        element.innerText = color_hex;
        element.classList.add(`square`);
        element.style.backgroundColor = color_hex;
        steps.appendChild(element);
    })
}

// render_steps();
async function __render_steps(){
    /** @type HTMLDivElement */
    let col_e = document.getElementById('color');
    if(col_e == null){
        return;
    }
    /** @type HTMLDivElement */
    let steps = col_e.children['steps'];
    steps.innerHTML = "";

    let max = 10;
    for(let r = 0; r <= max; r += 1)
    for(let g = 0; g <= max; g += 1)
    for(let b = 10; b <= max; b += 1) {
        let element = document.createElement('div');
        element.classList.add(`square`);
        let oklab = rgb_to_oklab( {r: r / max, g: g / max, b: b / max});
        let oklch = oklab_to_oklch( oklab );
        //let oklch = {L: 0.7, c: 0.2, h:  (i / max) * Math.PI};
        let rgb = oklab_to_rgb(oklab)
        let color = rgb_to_hex( rgb ); 


        oklch.L = oklch.L.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        oklch.c = oklch.c.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        oklch.h = oklch.h.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });

        oklab.L = oklab.L.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        oklab.a = oklab.a.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        oklab.b = oklab.b.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });

        rgb.r = rgb.r.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        rgb.g = rgb.g.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        rgb.b = rgb.b.toLocaleString("en-US",{ maximumFractionDigits: 2, minimumFractionDigits: 2 });
        
        element.style.backgroundColor = color;
        element.innerText +=`${oklab.L} ${oklab.a} ${oklab.b}, . . . . `
        element.innerText +=`${  rgb.r} ${  rgb.g} ${  rgb.b},`
        steps.appendChild(element);

        return;
    }
}

__render_steps();

/* Helper function to get the minor of a matrix.
 * @param {number[][]} matrix 
 * @param {number} row 
 * @param {number} col 
 * @returns {number[][]} Minor matrix
 */
function getMatrixMinor(matrix, row, col) {
    return matrix
        .filter((_, i) => i !== row) // Remove the current row
        .map(row => row.filter((_, j) => j !== col)); // Remove the current column
}

/**
 * Helper function to calculate the determinant of a matrix.
 * @param {number[][]} matrix 
 * @returns {number} Determinant
 */
function getMatrixDeterminant(matrix) {
    if (matrix.length === 2) {
        // Base case for 2x2 matrix
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let determinant = 0;
    for (let col = 0; col < matrix.length; col++) {
        const minor = getMatrixMinor(matrix, 0, col);
        const cofactor = matrix[0][col] * getMatrixDeterminant(minor);
        determinant += (col % 2 === 0 ? 1 : -1) * cofactor;
    }
    return determinant;
}

/**
 * Helper function to calculate the matrix of cofactors.
 * @param {number[][]} matrix 
 * @returns {number[][]} Matrix of cofactors
 */
function getMatrixOfCofactors(matrix) {
    const cofactors = [];
    for (let i = 0; i < matrix.length; i++) {
        cofactors[i] = [];
        for (let j = 0; j < matrix[i].length; j++) {
            const minor = getMatrixMinor(matrix, i, j);
            const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * getMatrixDeterminant(minor);
            cofactors[i][j] = cofactor;
        }
    }
    return cofactors;
}

/**
 * Helper function to transpose a matrix.
 * @param {number[][]} matrix 
 * @returns {number[][]} Transposed matrix
 */
function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

/**
 * Helper function to calculate the inverse of a matrix.
 * @param {number[][]} matrix 
 * @returns {number[][]} Inverse matrix
 */
function getMatrixInverse(matrix) {
    const determinant = getMatrixDeterminant(matrix);
    if (determinant === 0) {
        throw new Error("Matrix is not invertible (determinant is zero)");
    }

    const cofactors = getMatrixOfCofactors(matrix);
    const adjugate = transposeMatrix(cofactors);

    // Divide each element by the determinant
    const inverse = adjugate.map(row => row.map(val => val / determinant));
    return inverse;
}

/**
 * Helper function to multiply two matrices.
 * @param {number[][]} A 
 * @param {number[][]} B 
 * @returns {number[][]} Resulting matrix
 */
function matrixMultiplyOptimized(A, B) {
    if (A[0].length !== B.length) {
        throw new Error("Incompatible matrix dimensions for multiplication");
    }

    const BTransposed = transposeMatrix(B);
    const result = new Array(A.length);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(BTransposed.length).fill(0);
    }

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < BTransposed.length; j++) {
            for (let k = 0; k < A[0].length; k++) {
                result[i][j] += A[i][k] * BTransposed[j][k];
            }
        }
    }

    return result;
}
