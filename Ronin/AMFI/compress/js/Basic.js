var GameScreen = 0;
const GAMEMENU = 0;
const GAMEPLAY = 1;
const GAMEOVER = 5;
const CLR_BLUE = '#056dae';
const CLR_ORG = '#ff9e22';
const CLR_WHT = '#ffffff';
var sx = 0, sy = 0, sz = 0, rx = 0, ry = 0, rz = 0, clr = 5;
const QUESTION = [
      {
        "que": "Which of the following is a benefit of\nSystematic Investment Plans (SIPs)?",
        "ans": [
          "Rupee Cost Averaging",
          "Inculcating financial discipline",
          "Compounding benefit",
          "All of the above"
        ],
        "correct": 3
      },
      {
        "que": "In which of the following instruments\ncan a Mutual Fund scheme invest?",
        "ans": [
          "Stocks",
          "Corporate & Government Bonds",
          "Gold",
          "All of the above"
        ],
        "correct": 3
      },
      {
        "que": "A diversified Equity Fund invests in _____.",
        "ans": [
          "One sector",
          "Bonds across various sectors",
          "Stocks across various sectors",
          "All of the above"
        ],
        "correct": 2
      },
      {
        "que": "Which of the following is an advantage\nof investing in Mutual Funds?",
        "ans": [
          "Professional management",
          "Diversified risk on your investments",
          "Capital appreciation",
          "All of the above"
        ],
        "correct": 3
      },
      {
        "que": "What is SIP?",
        "ans": [
          "Name of a Mutual Fund",
          "Method of regular investment",
          "Diversification Plan",
          "Method of lumpsum investment"
        ],
        "correct": 1
      },
      {
        "que": "What is the primary advantage of investing\nin Equity Linked Saving Schemes (ELSS)?",
        "ans": [
          "Tax saving",
          "Buy and Hold",
          "Instant returns",
          "None of the above"
        ],
        "correct": 0
      },
      {
        "que": "How is Rupee Cost Averaging beneficial\nto you as an investor?",
        "ans": [
          "Gives assured returns",
          "Eliminates the need to time the market",
          "Helps in timing the market",
          "All of the above"
        ],
        "correct": 1
      },
      {
        "que": "What is the full form of SIP?",
        "ans": [
          "Systematic Investing Plan",
          "Systematic Insurance Plan",
          "System Investment Proof",
          "Systematic Investment Plan"
        ],
        "correct": 3
      },
      {
        "que": "Which open-ended scheme can\nreplicate/track a particular index?",
        "ans": [
          "Equity Funds",
          "Stock Funds",
          "Index Funds",
          "Debt Funds"
        ],
        "correct": 2
      },
      {
        "que": "What is the benefit of staying\ninvested for the long term?",
        "ans": [
          "Benchmark Index",
          "Reduced Volatility",
          "Short term growth",
          "Asset allocation"
        ],
        "correct": 1
      }
    ];




    function aVeryBigSum(ar) {
      console.log((ar[0]+'').length+' aVeryBigSum '+ar.length);
      var c = '';
      var temp = 0;
      var mx = 0;
      for(var i = 0;i<ar.length;i++){
        if((ar[i]+'').length>mx){
          mx = (ar[i]+'').length;
        }
      }

      for(var j=0;j<mx;j++){
          for(var i = 0;i<ar.length;i++){
              var a = ar[i]+'';
              if(j< a.length){
                temp += parseInt(a.charAt(a.length-1-j));
              }
          }
          c = (temp%10)+''+ c;
          console.log(c,temp,parseInt(temp/10));
          temp = parseInt(temp/10);
      }
      if(temp > 0){
           c = temp+c;
      }
      return c;
  }
  
  console.log(aVeryBigSum([1,2,3,4,5]));

function set_rad(){
    gsap.to(mGame, {
        duration: 8,
        rad: Math.PI,
        dis:10,
        ease: 'power2'
      })
      gsap.to(mGame.camera.position, {
        duration: 5,
        y: 2,
        ease: 'power2'
      })
}
function loadTexture(str) {
    let image = new Image(); image.src = str;
    const texture = new THREE.Texture();
    texture.image = image;
    image.onload = function () { texture.needsUpdate = true; };
    return texture;
}
function loadSound(nam, str) {
    var x = document.createElement("audio");
    x.setAttribute("src", str);
    x.setAttribute("id", nam);
    document.body.appendChild(x);
    return x;
}
function loadUI(gameUI, assetpath, x, y, clickval) {
    var sprite = gameUI.createSprite(assetpath);
    sprite.alpha = 1;
    sprite.x = x;
    sprite.y = y;
    sprite.width = sprite.width * 1.1;
    sprite.height = sprite.height * 1.1;
    sprite.pivot.x = 0.5;
    sprite.pivot.y = 0.5;
    sprite.anchor.x = ThreeUI.anchors.center;
    sprite.anchor.y = ThreeUI.anchors.center;
    sprite.visible = false;
    sprite.alpha = 0;
    if (clickval > 0) {
        sprite.onClick(() => { mGame.Handle_Menu(clickval); });
    }
    return sprite;
}
function createTexts(gameUI, text, size, color, anchorx, anchory, textAlign, tpye) {
    var lbltext = gameUI.createText(text, size, tpye, color);
    lbltext.anchor.x = anchorx;
    lbltext.anchor.y = anchory;
    lbltext.textAlign = textAlign;
    lbltext.visible = false;
    return lbltext;
}
function DrawTexture(tex, x, y, sx, sy,a) {
    tex.x = x;
    tex.y = y;
    tex.alpha =  a || 1;
    tex.width = sx;
    tex.height = sy;
    tex.anchor.x = ThreeUI.anchors.center;
    tex.anchor.y = ThreeUI.anchors.center;
    tex.visible = true;
}
function DrawLbl(tex, lbl, x, y, color, siz,a) {
    tex.x = x;
    tex.y = y;
    tex.text = lbl;
    tex.color = color || '#fafafa';
    tex.size = siz || 50;
    tex.anchor.x = ThreeUI.anchors.center;
    tex.anchor.y = ThreeUI.anchors.center;
    tex.visible = true;
    tex.textAlign = a||'center';
}
function DrawLblAlfa(tex, lbl, x, y, color, siz,a,align) {
    tex.x = x;
    tex.y = y;
    tex.text = lbl;
    tex.color = color || '#fafafa';
    tex.size = siz || 50;
    tex.anchor.x = ThreeUI.anchors.center;
    tex.anchor.y = ThreeUI.anchors.center;
    tex.visible = true;
    tex.alpha =  a || 1;
    tex.textAlign = align||'center';
}
function loadUIRect(gameUI, x, y, dx, dy, color) {
    var rect = gameUI.createRectangle(color, x, y, dx, dy);
    rect.alpha = 1.0;
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
function dealWithKeyboard(e) {
    var vs = 1, rs = .1;
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
        case 49:
            rx = rx - rs;
            break;
        case 50:
            rx = rx + rs;
            break;
        case 52:
            ry = ry + rs;
            break;
        case 53:
            ry = ry - rs;
            break;
        case 55:
            rz = rz + rs;
            break;
        case 56:
            rz = rz - rs;
            break;
        case 57:
            sx = sy = sz = 0;
            break;
        case 54:
            rx = ry = rz = 0;
            break;
    }
    console.log("sx = " + sx + ", sy = " + sy + ", sz =" + sz);
    console.log(e.keyCode + " rx = " + rx + ", ry = " + ry + ", rz =" + rz);
}
function compRan() {
    return 0.5 - Math.random();
  }
function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}
function createColor() {
    clr++;
    var frequency = 0.03;
    r = Math.floor(Math.sin(frequency * clr + 0) * 127 + 128);
    g = Math.floor(Math.sin(frequency * clr + 2) * 127 + 128);
    b = Math.floor(Math.sin(frequency * clr + 4) * 127 + 128);
    return new THREE.Color('rgb(' + r + ',' + g + ',' + b + ')');
}
var isMobile = {
    Android: function () { return navigator.userAgent.match(/Android/i); },
    BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
    iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
    Windows: function () { return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i); },
    any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};
