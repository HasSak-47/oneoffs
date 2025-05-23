
type rgb_color = {
    r:number,
    g:number,
    b:number,
}

type lch_color = {
    L:number,
    c:number,
    h:number,
}

type lab_color = {
    L:number,
    a:number,
    b:number,
}

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

function oklab_to_rgb({L, a, b}: {L: number, a: number, b: number}){
    let l = iM2[0][0] * L + iM2[0][1] * a + iM2[0][2] * b;
    let m = iM2[1][0] * L + iM2[1][1] * a + iM2[1][2] * b;
    let s = iM2[2][0] * L + iM2[2][1] * a + iM2[2][2] * b;

    l = l * l * l;
    m = m * m * m;
    s = s * s * s;

    return {
        r: iMrgb[0][0] * l + iMrgb[0][1] * m + iMrgb[0][2] * s,
        g: iMrgb[1][0] * l + iMrgb[1][1] * m + iMrgb[1][2] * s,
        b: iMrgb[2][0] * l + iMrgb[2][1] * m + iMrgb[2][2] * s
    };
}

function rgb_to_oklab({r, g, b}: {r: number, g: number, b: number}){
    let l = Mrgb[0][0] * r + Mrgb[0][1] * g + Mrgb[0][2] * b;
    let m = Mrgb[1][0] * r + Mrgb[1][1] * g + Mrgb[1][2] * b;
    let s = Mrgb[2][0] * r + Mrgb[2][1] * g + Mrgb[2][2] * b;

    l = Math.pow(l, 1/3)
    m = Math.pow(m, 1/3)
    s = Math.pow(s, 1/3)

    let lab = {L: 0, a: 0, b: 0};

    lab.L = M2[0][0] * l + M2[0][1] * m + M2[0][2] * s;
    lab.a = M2[1][0] * l + M2[1][1] * m + M2[1][2] * s;
    lab.b = M2[2][0] * l + M2[2][1] * m + M2[2][2] * s;

    return lab;
}

function oklch_to_oklab({ L, c, h } : {L: number, c: number, h:number}) {
    const a = c * Math.cos(h);
    const b = c * Math.sin(h);
    return { L, a, b };
}

function oklab_to_oklch({ L, a, b } : lab_color) {
    const c = Math.sqrt(a * a + b * b);
    const h = Math.atan2(b, a); // Returns hue in radians
    return { L, c, h };
}


function hex_to_rgb(hx: string) {
    hx = hx.replace(/^#/, '');

    // Parse the hex string into red, green, and blue components
    const r = parseInt(hx.substring(0, 2), 16) / 255;
    const g = parseInt(hx.substring(2, 4), 16) / 255;
    const b = parseInt(hx.substring(4, 6), 16) / 255;

    return { r, g, b };
}

function rgb_to_hex({ r, g, b } : rgb_color) {
    const to_hex = (val : number) => {
        let hex = Math.round(val * 255);
        if(hex < 0)
            hex = 0;
        if(hex > 255)
            hex = 255;
        const st = hex.toString(16)
        return st.length === 1 ? `0${st}` : st;
    };

    const hexR = to_hex(r);
    const hexG = to_hex(g);
    const hexB = to_hex(b);

    return `#${hexR}${hexG}${hexB}`;
}


function color_step(beg: lch_color, end: lch_color, step: number){
    // handle when chroma is small
    if(beg.c < 0.001){
        beg.h = end.h;
    }
    if(end.c < 0.001){
        end.h = beg.h;
    }

    step = step - 1;
    let delta = {
        L: (end.L - beg.L) / step,
        c: (end.c - beg.c) / step,
        h: (end.h - beg.h) / step,
    }

    let arr : lch_color[] = [];
    for(let i = 0; i <= step; ++i){
        let val = {
            L: beg.L + i * delta.L,
            c: beg.c + i * delta.c,
            h: beg.h + i * delta.h,
        }
        arr.push(val);
    }

    return arr;
}

let beg_color = document.getElementById('color-beg')! as HTMLInputElement; 
let end_color = document.getElementById('color-end')! as HTMLInputElement; 
let count_color = document.getElementById('color-count')! as HTMLInputElement; 
beg_color.onchange = _ => render_steps();
end_color.onchange = _ => render_steps();
count_color.onchange = _ => render_steps();

function render_steps(){
    let col_e = document.getElementById('color')! as HTMLDivElement;
    if(col_e === null){
        return;
    }

    let get_in_val = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
    let beg = oklab_to_oklch( rgb_to_oklab( hex_to_rgb( get_in_val('color-beg') )));
    let end = oklab_to_oklch( rgb_to_oklab( hex_to_rgb( get_in_val('color-end') )));
    let step = parseInt(get_in_val('color-count'));

    let steps = document.getElementById('pallete')! as HTMLDivElement;
    steps.innerHTML = "";

    let colors = color_step(beg, end, step);
    colors.forEach((color, idx) => {
        let element = document.createElement('div');
        let color_hex = rgb_to_hex(oklab_to_rgb(oklch_to_oklab(color)));
        color.L = color.L + 0.4;
        if (color.L > 1.0)
            color.L -= 1;
        color.c = 0;
        color.h = color.L + Math.PI;
        let text_hex = rgb_to_hex(oklab_to_rgb(oklch_to_oklab(color)));
        element.id = `color-${idx}`;
        element.innerText = color_hex;
        element.classList.add(`square`);
        element.style.backgroundColor = color_hex;
        element.style.color = text_hex;
        element.onclick = _ =>  {
            navigator.clipboard.writeText(color_hex);
        };
        steps.appendChild(element);
    })

}
render_steps();
