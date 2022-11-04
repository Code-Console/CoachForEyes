let mItemTouch=0;
const HoldTime=1;
let mMobileX=0;
let mMobileY=0;
class Item{
    constructor(){
        this.x =0;
        this.y =0;
        this.no=0;
    }
    SetItem(_x,_y,_no){
        this.x  = _x;
        this.y  = _y;
        this.no = _no;
    }
}
class Card{
    constructor(){
        this.x=0;
        this.y=0;
        this.touch=0;
        this.mItem = null;
    }
    SetCard(_x,_y){
        this.x = _x;
        this.y = _y;
        this.touch=0;
    }
}
class Profile{
    constructor(){
        this.x=0;
        this.y=0;
        this.vx=0;
        this.mImgdp=null;
        this.mItem;
        this.mCorrect=0;
        this.mFadAnim=0;
        this.mNodege=0;
        this.mTimer=15;
        this.mFullTime=360;
        this.mTimeInc=this.mFullTime/this.mTimer;
        this.end= false;
        this.mBlink=0;
        this.sx=10;
        this.sy=10;
        this.sa=1;
        this.mAniCnt=0;
    }
    SetProfile(_x,_y,_imgdp){
        this.x = _x;
        this.y = _y;
        this.mImgdp   = _imgdp;
        this.mCorrect=0;
        this.mFadAnim=0;
        this.mAniCnt=0;
    }
    UpdateTime(){
        if(this.x>-1 && this.x<.9 && this.y<1){
            this.mFullTime -=this.mTimeInc;
        }
    }
}

let maxX = 1100;
let maxY = 1920;
let mGame, mRenderTex,mRenderTex2,mRenderTex3;
let mGameFont,mGameFont1,mGameFont2,mGameFont3,mArialFont;
let mTex_Bg,mTex_Start,mTex_Title,mTex_MobileBg,mTex_WhiteBox,mTex_Products=[],mTex_Circle,mTex_Card,mTex_TimeBar,mTex_FillBar,mTex_GreenBox,mTex_RedBox;
let mTex_ScoreCir,mTex_FinalBG,mTex_FinalBG2,mTex_TxtHelp,mTex_StartTxt,mTex_RoundRect,mTex_ProfilePic=[],mTex_PopUp,mTex_CongTxt,mTex_Continue,mTex_Download,mTex_Browse;
let mTex_CashOn,mTex_PlayAgain,mTex_CardSel,mTex_like,mTex_BgTrans,mTex_ScoreBar,mTex_Arrow,mTex_Try,mTex_tut1,mTex_tut2,mTex_txt_Res;
let mTex_DragOBJ = null;
let Snd_Wrong,Snd_Right,Snd_BG,Snd_Cheer,Snd_fail;
let mCamera,mScene;
let _arr=[],_profile=[];
let mLoadCnt=0;
let mRed_speck,mYellow_speck,mGreen_speck,mBlue_speck;
let mRed_ribbon,mYellow_ribbon,mPink_ribbon,mBlue_ribbon;

let m_red_specks    = [];
let m_blue_specks   = [];
let m_green_specks  = [];
let m_yellow_specks = [];

class InitScene extends Phaser.Scene {

	constructor() {
		super('InitScene');
	}
	preload() {
    document.body.style.backgroundImage = "url("+common_bg+")";
		mScene = this;
		mCamera = this.cameras;
		// mCamera.main.setBackgroundColor("#808080");
		// LoadImage(this.load,'Logo.png');

		mScene.sound.decodeAudio('wrongsnd',wrong_snd);
		mScene.sound.decodeAudio('snd_correct',snd_correct);
		mScene.sound.decodeAudio('bg_snd',bg_snd);
		mScene.sound.decodeAudio('cheer_snd',cheer_snd);

		AddBase64Image('splash_bg',splash_bg)
		AddBase64Image('start_btn',start_btn);
		AddBase64Image('title_img',title_img);
		AddBase64Image('mobile_bg',mobile_bg);
		AddBase64Image('white_box',white_box);
		_arr=[item_0,item_1,item_2,item_3,item_4,item_5,item_6,item_7,item_8,item_9,item_10,item_11,item_12,item_13,item_14,item_15,item_16,item_17,item_18,item_19];
		for(let i=0;i<_arr.length;i++)
		AddBase64Image('item'+i,_arr[i]);
		AddBase64Image('circle_black',circle_black);
		AddBase64Image('card',card);
		AddBase64Image('time_bar',time_bar);
		AddBase64Image('fill_bar',fill_bar);
		AddBase64Image('green_box',green_box);
		AddBase64Image('red_box',red_box);
		AddBase64Image('final_bg',final_bg);
		AddBase64Image('score_cir',score_cir);
		AddBase64Image('like_Bg',like_Bg);
		AddBase64Image('help_img',help_img);
		AddBase64Image('start_txt',start_txt);
		AddBase64Image('round_rect',round_rect);
    AddBase64Image('txt_Res',txt_Res);
    _profile = [profile_0,profile_1,profile_2,profile_3,profile_4,profile_5,profile_6,profile_7,profile_8,profile_9];
		for(let i=0;i<_profile.length;i++)
		AddBase64Image('profile_'+i,_profile[i]);

		AddBase64Image('pop_up',pop_up);
		AddBase64Image('cong_txt',cong_txt);
		AddBase64Image('try_txt',try_txt);
		AddBase64Image('continue_btn',continue_btn);
		AddBase64Image('download_btn',download_btn);
		AddBase64Image('browse_prod',browse_prod);
		AddBase64Image('cash_on',cash_on);
		AddBase64Image('play_again',play_again);
		AddBase64Image('card_sel',card_sel);
		AddBase64Image('like_txt',like_txt);
		AddBase64Image('red_speck',red_speck);
		AddBase64Image('yellow_speck',yellow_speck);
		AddBase64Image('green_speck',green_speck);
		AddBase64Image('blue_speck',blue_speck);
		AddBase64Image('red_ribbon',red_ribbon);
		AddBase64Image('yellow_ribbon',yellow_ribbon);
		AddBase64Image('pink_ribbon',pink_ribbon);
		AddBase64Image('blue_ribbon',blue_ribbon);
		AddBase64Image('bg_trans',bg_trans);
		AddBase64Image('score_bar',score_bar);
		AddBase64Image('arrow',arrow);
		AddBase64Image('tut1_img',tut1_img);
		AddBase64Image('tut2_img',tut2_img);
	}
	create() {

		checkOriention(this.scale.orientation);
		this.scale.on('orientationchange', checkOriention, this);
		mGameFont = this.add.text(XPos(outPos),XPos(outPos), '',{fontFamily: 'myfont_medium',align: 'center', fontSize: '64px', color: '#fff'});
		mGameFont.setOrigin(.5, .5);

		mGameFont1 = this.add.text(XPos(outPos),XPos(outPos), '',{fontFamily: 'myfont_medium',align: 'center', fontSize: '48px', color: '#fff'});
		mGameFont1.setOrigin(0, .5);

		mGameFont2 = this.add.text(XPos(outPos),XPos(outPos), '',{fontFamily: 'myfont_medium',align: 'center', fontSize: '48px', color: '#fff'});
		mGameFont2.setOrigin(1, .5);

		mGameFont3 = this.add.text(XPos(outPos),XPos(outPos), '',{fontFamily: 'myfontregular',align: 'center', fontSize: '48px', color: '#fff'});
		mGameFont3.setOrigin(.5, .5);

		mArialFont = this.add.text(XPos(outPos),XPos(outPos), '',{fontFamily: 'Arial',align: 'center', fontSize: '48px', color: '#fff'});
		mArialFont.setOrigin(.5, .5);

		mRenderTex = this.add.renderTexture(0, 0, maxX, maxY);
		mRenderTex.setDepth(101);

		mRenderTex2 = this.add.renderTexture(0, 0, maxX, maxY);
		mRenderTex2.setCrop(100,YPos(.01),maxX, maxY);
		mRenderTex2.setDepth(101);

		mRenderTex3 = this.add.renderTexture(0, 0, maxX, maxY);
		mRenderTex3.setDepth(102);

		mScene.sound.on('decoded', function (key) {

			if(key === "wrongsnd")
				Snd_Wrong = mScene.sound.add(key);
			if(key === "snd_correct")
				Snd_Right = mScene.sound.add(key);
			if(key === "bg_snd")
				Snd_BG = mScene.sound.add(key);
			if(key === "cheer_snd")
				Snd_Cheer = mScene.sound.add(key);
			if(key === "cheer_snd")
				Snd_fail = mScene.sound.add(key);


		});

		let mAddCnt=0;
		this.textures.on('addtexture', function (key,value) {

				if(key ==='splash_bg')
					mTex_Bg  	= this.add.image(XPos(outPos), XPos(outPos),key);
				if(key ==='start_btn')
					mTex_Start  = this.add.image(XPos(outPos), XPos(outPos),key);
				if(key ==='title_img')
					mTex_Title  = this.add.image(XPos(outPos), XPos(outPos),key);

				if(key ==='mobile_bg')
					mTex_MobileBg = this.add.image(XPos(outPos), XPos(outPos),key);
				if(key ==='white_box')
					mTex_WhiteBox = this.add.image(XPos(outPos), XPos(outPos),key);
				if(key ==='green_box')
					mTex_GreenBox = this.add.image(XPos(outPos), XPos(outPos),key);

				if(key ==='red_box')
					mTex_RedBox = this.add.image(XPos(outPos), XPos(outPos),key);

				for(let i=0;i<_arr.length;i++)
				{
					if(key === 'item'+i)
						mTex_Products[i] =  this.add.image(XPos(outPos), XPos(outPos),key);
				}
				if(key === 'circle_black')
					mTex_Circle =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'card')
					mTex_Card =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'time_bar')
					mTex_TimeBar =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'fill_bar')
					mTex_FillBar =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'final_bg')
					mTex_FinalBG =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'score_cir')
					mTex_ScoreCir =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'like_Bg')
					mTex_FinalBG2 =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'help_img')
					mTex_TxtHelp =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'start_txt')
					mTex_StartTxt =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'round_rect')
					mTex_RoundRect =  this.add.image(XPos(outPos), XPos(outPos),key);


				for(let i=0;i<_profile.length;i++)
				{
					 if(key === 'profile_'+i)
					 	mTex_ProfilePic[i] =  this.add.image(XPos(outPos), XPos(outPos),key);
				}
				if(key === 'pop_up')
					mTex_PopUp  =  this.add.image(XPos(outPos), XPos(outPos),key);

				if(key === 'cong_txt')
					mTex_CongTxt  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'try_txt')
					mTex_Try  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'continue_btn')
					mTex_Continue  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'download_btn')
					mTex_Download  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'browse_prod')
					mTex_Browse  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'cash_on')
					mTex_CashOn =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'play_again')
					mTex_PlayAgain =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'card_sel')
					mTex_CardSel =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'like_txt')
					mTex_like =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'bg_trans')
					mTex_BgTrans =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'score_bar')
					mTex_ScoreBar  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'arrow')
					mTex_Arrow  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'tut1_img')
					mTex_tut1  =  this.add.image(XPos(outPos), XPos(outPos),key);
				if(key === 'tut2_img')
					mTex_tut2  =  this.add.image(XPos(outPos), XPos(outPos),key);
        if(key ==='txt_Res')
          mTex_txt_Res  	= this.add.image(XPos(outPos), XPos(outPos),key);


				if(key === "red_speck")
				{
					mRed_speck = this.add.particles(key);
					mRed_speck.depth = -1;
				}
				if(key === 'yellow_speck')
				{``
					mYellow_speck = this.add.particles(key);
					mYellow_speck.depth = -1;
				}
				if(key === 'green_speck')
				{
					mGreen_speck = this.add.particles('green_speck');
					mGreen_speck.depth = 10;
				}
				if(key === 'blue_speck')
				{
					mBlue_speck = this.add.particles('blue_speck');
					mBlue_speck.depth = 10;
				}

				if(key === 'red_ribbon')
				{
					mRed_ribbon = this.add.sprite(XPos(outPos), YPos(outPos), 'red_ribbon');
					mRed_ribbon.depth = 10;
					mRed_ribbon.alpha = 0;
				}
				if(key ==="yellow_ribbon")
				{
					mYellow_ribbon = this.add.sprite(XPos(outPos), YPos(outPos), 'yellow_ribbon');
					mYellow_ribbon.depth = 10;
					mYellow_ribbon.alpha = 0;
				}
				if(key ==="pink_ribbon")
				{
					mPink_ribbon = this.add.sprite(XPos(outPos), YPos(outPos), 'pink_ribbon');
					mPink_ribbon.depth = 10;
					mPink_ribbon.alpha = 0;
				}
				if(key ==="blue_ribbon")
				{
					mBlue_ribbon = this.add.sprite(XPos(outPos), YPos(outPos), 'blue_ribbon');
					mBlue_ribbon.depth = 10;
					mBlue_ribbon.alpha = 0;
				}


			mAddCnt++;
			if(mAddCnt>=mLoadCnt)
			{
				this.scene.add('GameScene', GameScene, true);
			}
		}, this);
		// mScene.events.on('ready', Ready);
		// Snd_Over 	=	 this.sound.add('gameover');
	}

}

function CallBurst(scene)
{
	const confettiDuration = 200;
	const minspd=-5000,maxspd=5000;
	scene.tweens.add({
		targets: [mRed_ribbon],
		duration: confettiDuration,
		scale: 2,
		alpha: 0.9,
		x: XPos(0) + 500,
		y: YPos(0) + 300,
		ease: 'Sine.InOut',
		onStart: function(){
		  mRed_ribbon.scale = 0;
		  mRed_ribbon.alpha = 0;
		}.bind(this)
	  });

	  scene.tweens.add({
		targets: [mYellow_ribbon],
		duration: confettiDuration,
		scale: 2,
		alpha: 0.9,
		x: XPos(0) - 500,
		y: YPos(0) + 200,
		ease: 'Sine.InOut',
		onStart: function(){
		  mYellow_ribbon.scale = 0;
		  mYellow_ribbon.alpha = 0;
		}.bind(this)
	  });

	  scene.tweens.add({
		targets: [mBlue_ribbon],
		duration: confettiDuration,
		scale: 2,
		alpha: 0.9,
		x: XPos(0) + 500,
		y: YPos(0) + 500,
		ease: 'Sine.InOut',
		onStart: function(){
			mBlue_ribbon.scale = 0;
			mBlue_ribbon.alpha = 0;
		}.bind(this)
	  });

	  scene.tweens.add({
		targets: [mPink_ribbon],
		duration: confettiDuration,
		scale: 2,
		alpha: 0.9,
		x: XPos(0) + 500,
		y: YPos(0) - 500,
		ease: 'Sine.InOut',
		onStart: function(){
			mPink_ribbon.scale = 0;
			mPink_ribbon.alpha = 0;
		}.bind(this)
	  });

	  for(var i = 0; i < 50; i++){
		 m_red_specks[i] = mRed_speck.createEmitter({
		  x: XPos(0),
		  y: YPos(0),
		  speed: { min: minspd, max: maxspd },
		  angle: { min: 0, max: 360 },
		  scale: { start: 1, end: 1.2 },
		  alpha: { start: 1, end: 0 },
		  lifespan: { min: 500, max: 4000 },
		  gravityY: -12
		});
	  }
	  for(var i = 0; i < 50; i++){
		m_blue_specks[i] = mBlue_speck.createEmitter({
		  x: XPos(0),
		  y: YPos(0),
		  speed: { min: minspd, max: maxspd },
		  angle: { min: 0, max: 360 },
		  scale: { start: 1, end: 1.2 },
		  alpha: { start: 1, end: 0 },
		  lifespan: { min: 500, max: 4000 },
		  gravityY: -12
		});
	  }
	  for(var i = 0; i < 50; i++){
		 m_green_specks[i] = mGreen_speck.createEmitter({
		  x: XPos(0),
		  y: YPos(0),
		  speed: { min: minspd, max: maxspd },
		  angle: { min: 0, max: 360 },
		  scale: { start: 1, end: 1.2 },
		  alpha: { start: 1, end: 0 },
		  lifespan: { min: 500, max: 4000 },
		  gravityY: -12
		});
	  }
	  for(var i = 0; i < 50; i++){
		m_yellow_specks[i] = mYellow_speck.createEmitter({
		  x: XPos(0),
		  y: YPos(0),
		  speed: { min: minspd, max: maxspd },
		  angle: { min: 0, max: 360 },
		  scale: { start: 1, end: 1.2 },
		  alpha: { start: 1, end: 0 },
		  lifespan: { min: 500, max: 4000 },
		  gravityY: -12
		});
	  }
	  for(var i = 0; i < 50; i++){
		m_red_specks[i].explode();
		m_green_specks[i].explode();
		m_blue_specks[i].explode();
		m_yellow_specks[i].explode();
	  }
}
document.addEventListener("visibilitychange", function (e) {
	if (document.visibilityState === 'hidden') {

	}
	else {

	}

});
let isKeyPress = false;
document.addEventListener('keydown', function (event) {
	const key = event.code;
	// if (!isKeyPress)
	 {
		switch (key) {
			case 'ArrowRight':

				 PX+=.01;
				break;
			case 'ArrowLeft':
				PX-=.01;
				break;
			case 'ArrowUp':
				PY+=.01;
				break;
			case 'ArrowDown':
				PY-=.01;
				break;
			case 'Space':
				break;
		}
	}
	isKeyPress = true;
});
document.addEventListener('keyup', function (event) {
	const key = event.code;
	switch (key) {
		case 'ArrowRight':
			break;
		case 'ArrowLeft':
			break;
		case 'ArrowUp':
			break;
		case 'ArrowDown':
			break;
	}
	isKeyPress = false;
});

function checkOriention(orientation) {
	if (orientation === Phaser.Scale.PORTRAIT) {
		// if (!mGame.device.os.desktop) {
		// 	document.getElementById("turn").style.display = "none";

		// }
	}
	else if (orientation === Phaser.Scale.LANDSCAPE) {

		// if (!mGame.device.os.desktop) {
		// 	document.getElementById("turn").style.display = "none";
		// }
	}
}
function LoadImage(load, path) {
	path = 'assets/' + path;
	var f_index = path.indexOf("/");
	var l_index = path.indexOf(".");
	var name = path.substring(f_index + 1, l_index);
	load.image(name, path);
}
function LoadSVGImage(load, path) {
	path = 'assets/' + path;
	var f_index = path.indexOf("/");
	var l_index = path.indexOf(".");
	var name = path.substring(f_index + 1, l_index);
	load.svg(name, path);
	//  load.svg(name,path, { width: w, height: h });
}
function LoadSVGImageWH(load, path, w, h) {
	path = 'assets/' + path;
	var f_index = path.indexOf("/");
	var l_index = path.indexOf(".");
	var name = path.substring(f_index + 1, l_index);
	load.svg(name, path, { width: w, height: h });
}
function LoadSVGImageScal(load, path, scal) {
	path = 'assets/' + path;
	var f_index = path.indexOf("/");
	var l_index = path.indexOf(".");
	var name = path.substring(f_index + 1, l_index);
	load.svg(name, path, { scale: scal });
	//  load.svg(name,path, { width: w, height: h });
}
function GetImage(add, path) {
	path = 'assets/' + path;
	let f_index = path.indexOf("/");
	let l_index = path.indexOf(".");

	let name = path.substring(f_index + 1, l_index);
	let img = add.image(XPos(0), YPos(0),name);
	img.setOrigin(.5, .5);
	img.setVisible(false);
	return img;

}
function AddBase64Image(_key,_base64)
{
	mScene.textures.addBase64(_key,_base64)
	mLoadCnt++;

}
var isMobile = {
	Android: function () { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function () { return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i); },
	any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

var GameConfig = {
	type: Phaser.CANVAS, //WEBGL CANVAS
	width: maxX,
	height: maxY,
	parent: 'gameContainer',
  "render.transparent": true,
	scene: [InitScene],
  transparent: true,
	// scene: {
	//     preload: preload,
	//     create: create,
	//     update: update
	// },
	audio: {
		disableWebAudio: false
	},
	scale: {
		mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,// Phaser.Scale.HEIGHT_CONTROLS_WIDTH,// Phaser.Scale.FIT,//Phaser.Scale.WIDTH_CONTROLS_HEIGHT, //ENVELOP
		autoCenter: Phaser.Scale.CENTER_BOTH,
		orientation: Phaser.Scale.Orientation.PORTRAIT, //PORTRAIT LANDSCAPE

	},
	fps: {
		target: 60,
		min: 60,
		forceSetTimeOut: true
	}
};
//
// let crd=[];
// function rendmiseCard(){
// 	crd.sort(compRan);
// }
// function compRan() {
//   return 0.5 - Math.random();
// }
