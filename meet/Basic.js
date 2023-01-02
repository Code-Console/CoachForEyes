var GameScreen = 0;
const GAMELOGO = 0;
const GAMEMENU = 1;
const GAMEPLAY = 2;
const GAMEOVER = 4;
const GAMESTART = 5;
const GAMENAME = 6;
const GAMEPAUSE = 7;
const GAMELEADER = 8;
const GAMEWIN = 9;
const GAMEINVITE = 10;
var sx = 0,
    sy = 0,
    sz = 0,
    rx = 0,
    ry = 0,
    rz = 0;


var frequency = .5;
var col = 1;
var BUTTONFONT = "#551b1b";
var BUTTONCOL2 = "#d2f6dd";
var COLOR0 = "#3d0834";
var COLOR1 = "#fff0fd";

function createColor() {
    r = Math.floor(Math.sin(frequency * col + 0) * 127 + 128);
    g = Math.floor(Math.sin(frequency * col + 2) * 127 + 128);
    b = Math.floor(Math.sin(frequency * col + 4) * 127 + 128);
    col++;
    return new THREE.Color('rgb(' + r + ',' + g + ',' + b + ')');
}

function loadUI(assetpath, x, y, s) {
    var sprite = gameUI.createSprite(assetpath);
    sprite.alpha = 1;
    sprite.x = x;
    sprite.y = y;
    sprite.pivot.x = 0.5;
    sprite.pivot.y = 0.5;
    sprite.anchor.x = ThreeUI.anchors.center; // Default
    sprite.anchor.y = ThreeUI.anchors.center; // Default
    sprite.visible = false;
    sprite.alpha = 1;
    if (s > 0) {
        sprite.width = sprite.width * s;
        sprite.height = sprite.height * s;
    }
    return sprite;
}

function loadUIS(assetpath, x, y, s) {
    var sprite = gameUI.createSprite(assetpath);
    sprite.alpha = 1;
    sprite.x = x;
    sprite.y = y;
    sprite.pivot.x = 0.5;
    sprite.pivot.y = 0.5;
    sprite.width = sprite.width * s;
    sprite.height = sprite.height * s;
    sprite.anchor.x = ThreeUI.anchors.right; // Default
    sprite.anchor.y = ThreeUI.anchors.bottom; // Default
    sprite.visible = false;
    sprite.alpha = 1;
    return sprite;
}

function createTexts(text, size, color, anchorx, anchory, textAlign, tpye) {
    var lbltext = this.gameUI.createText(text, size, tpye, color);
    lbltext.anchor.x = anchorx;
    lbltext.anchor.y = anchory;
    lbltext.textAlign = textAlign;
    lbltext.visible = false;
    return lbltext;
}

function DrawTexture(tex, x, y) {

    tex.x = x;
    tex.y = y;
    tex.anchor.x = ThreeUI.anchors.center; // Default
    tex.anchor.y = ThreeUI.anchors.center; // Default
    tex.visible = true;
}

function DrawTransScal(tex, x, y, sx, sy, z, t) {
    tex.x = x;
    tex.y = y;
    tex.anchor.x = ThreeUI.anchors.center; // Default
    tex.anchor.y = ThreeUI.anchors.center; // Default
    tex.width = sx * z;
    tex.height = sy * z;
    tex.visible = true;
    tex.alpha = t;
}

function DrawTextureA(tex, x, y, ax, ay) {
    tex.x = x;
    tex.y = y;
    tex.visible = true;
    tex.anchor.x = ax;
    tex.anchor.y = ay;

}

function DrawLbl(tex, lbl, x, y, color, siz) {
    tex.x = x;
    tex.y = y;
    tex.text = lbl;
    tex.color = color || '#fafafa';
    tex.size = siz || 50;
    tex.anchor.x = ThreeUI.anchors.center;
    tex.anchor.y = ThreeUI.anchors.center;
    tex.visible = true;
    tex.textAlign = 'center';
}

function DrawLblA(tex, lbl, x, y, color, siz, ax, ay, textAlign) {
    tex.x = x;
    tex.y = y;
    tex.text = lbl;
    tex.color = color || '#fafafa';
    tex.size = siz || 50;
    tex.anchor.x = ax;
    tex.anchor.y = ay;
    tex.textAlign = textAlign;
    tex.visible = true;
}

function loadUIRect(color) {
    var rect = this.gameUI.createRectangle(color || '#222222', 0, 0, window.innerWidth * 3, window.innerHeight * 3);
    rect.alpha = 1.0;
    rect.anchor.x = ThreeUI.anchors.center;
    rect.anchor.y = ThreeUI.anchors.center;
    return rect;
}

function loadUIBar(x, y, dx, dy, color) {
    var rect = this.gameUI.createRectangle(color, x, y, dx, dy);
    rect.alpha = 0.01;
    rect.anchor.x = ThreeUI.anchors.center;
    rect.anchor.y = ThreeUI.anchors.center;
    rect.visible = false;
    return rect;
}

function Rect2RectIntersection(ax, ay, adx, ady, bx, by, bdx, bdy) {
    ax -= adx / 2;
    ay += ady / 2;
    bx -= bdx / 2;
    by += bdy / 2;



    if (ax + adx > bx && ay - ady < by && bx + bdx > ax && by - bdy < ay) {
        return true;
    }
    return false;
}

function circir(x1, y1, r1, x2, y2, r2) {
    if (r1 + r2 > Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))) {
        return true;
    }
    return false;
}

function CircRectsOverlap(CRX, CRY, CRDX, CRDY, centerX, centerY, radius) {
    if ((Math.abs(centerX - CRX) <= (CRDX + radius)) && (Math.abs(centerY - CRY) <= (CRDY + radius)))
        return true;

    return false;
}

function random(min, max) {
    return (min + (Math.random() * (max - min)));
}
var isMobile = {
    Android: function() { return navigator.userAgent.match(/Android/i); },
    BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
    Windows: function() { return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i); },
    any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

function upWithKeyboard(e) {
    switch (e.keyCode) {
        case 37: //left
            HandleGameplay(0, 2);
            break;
        case 39: //right
            HandleGameplay(1, 2);
            break;
        case 38: //Up
            break;
        case 40: //Down
            HandleGameplay(2, 2);
            break;
    }

}

function dealWithKeyboard(e) {
    var vs = 1,
        rs = .1;
    switch (e.keyCode) {
        case 37:
            sx = sx - vs;
            break;
        case 38:
            sz = sz + vs;
            break;
        case 39:
            sx = sx + vs;
            break;
        case 40:
            sz = sz - vs;
            break;
        case 65:

            sy = sy + vs;
            break;
        case 66:
        case 90:
            sy = sy - vs;
            break;
        case 49:case 97:
            rx = rx - rs;
            break;
        case 50:case 98:
            rx = rx + rs;
            break;
        case 52:case 101:
            ry = ry + rs;
            break;
        case 53:case 100:
            ry = ry - rs;
            break;
        case 55:case 104:
            rz = rz + rs;
            break;
        case 56:case 103:
            rz = rz - rs;
            break;
        case 57:case 105:
            sx = sy = sz = 0;
            break;
        case 54:case 102:
            rx = ry = rz = 0;
            break;
    }
    console.log("sx = " + sx + ", sy = " + sy + ", sz =" + sz);
    console.log(e.keyCode + " rx = " + rx + ", ry = " + ry + ", rz =" + rz);
}

function compRan() {
    return 0.5 - Math.random();
}