let GameScreen=0,mSel=0;
let TEST=100,outPos=-100;
let setMusic=true;
let Counter=0,Counter1=0;
const GAMELOGO = 0,GAMESPLASH = 1,GAMEBEGIN = 2,GAMEPLAY = 3,GAMECONG = 4,GAMEFINAL = 5,GAMEFINAL2 = 6,GAMETUT = 7;
let mProFile=[],mCard=[],mItemDrag = null;
let mCircle,mArc;
let mTimeBarY,mTimerAlpha=1,mTextAlpha=0,mProfileAnim=0,mTotalProfile=0;
let PX=0,PY=0;
let mTopY=0,mBottomY=0,mTimeBarWidth=0,mUserBonus=0,mTotalBonus=4000;
let mGameTime=60,mCorrectItem=0,mTutCnt=0;
let mov = 0;
const COINS = 400;
const MOBY = -.31;
let crd=[];
let moveScr = {y:0};
class GameScene extends Phaser.Scene {
	constructor (){super('GameScene');}
	// preload(){mCamera.main.setBackgroundColor("#fff");}
	create(){

		mScene - this;
		checkOriention(this.scale.orientation);

		this.scale.on('orientationchange', checkOriention, this);
		mCircle   = this.add.circle(XPos(outPos),YPos(outPos),10,'');
		mArc 	  = this.add.arc(XPos(outPos),YPos(outPos),52,0, 360, true,'');
		let isPress = false;
		this.input.on('pointerdown', function (pointer) {
			isPress = true;
			HandleEvent(0, pointer);
		}, this);
		this.input.on('pointermove', function (pointer) {
			if(isPress)
				HandleEvent(1, pointer);
		}, this);
		this.input.on('pointerup', function (pointer) {
			isPress  = false;
			HandleEvent(2, pointer);
		}, this);



		// document.getElementById("loaderbg").style.display = "none";
		this.scale.on('resize', this.resize, this);
		InitObj();

		GameScreen = GAMESPLASH;
		CallSplashAnim();
		mTutCnt=0;


	}
	update()
	{
// GameScreen =GAMECONG;
		mRenderTex.clear();
		mRenderTex2.clear();
		mRenderTex3.clear();
		switch(GameScreen){
			case GAMESPLASH:
				DrawSplash();
				break;
			case GAMETUT:
				DrawTutorial();
				break;
			case GAMEPLAY:
			case GAMEBEGIN:
				DrawGamePlay();
				break;
			case GAMECONG:
				DrawCong();
				break;
			case GAMEFINAL:
			case GAMEFINAL2:
				if(GameScreen === GAMEFINAL)
				{
					DrawTransScal(mRenderTex,mTex_FinalBG,0.01,-.55,1.4,mFinalAnim.bg);
					DrawTransScal(mRenderTex,mTex_Title,0,.8,1.4,mFinalAnim.ta);
					// let txt = "Like Mrs. Sharma,\nyou can also earn upto"
					// DrawTextColorScal(mRenderTex,mGameFont,txt,0,.4,1.2,0,0,0,mFinalAnim.text1A);
					// let rupee =  "\u20B9";
					// txt =   rupee+"25,000/month\n from home"
					// DrawTextColorScal(mRenderTex,mGameFont,txt,0,.1,1.6,255,120,176,mFinalAnim.text2A);
					DrawTransScal(mRenderTex,mTex_like,0,.3,1.35,mFinalAnim.text2A);
					// DrawTransScal(mRenderTex,mTex_Continue,0,-.85,mSel===1?1.5:1.4,mFinalAnim.ca);
					DrawTransScal(mRenderTex,mTex_Download,0,-.70,mSel===2?1.3:1.2,mFinalAnim.ca);
					DrawTransScal(mRenderTex,mTex_PlayAgain,0,-.90,mSel===1?1.3:1.2,mFinalAnim.pa);
				}
				else
				{
					DrawTransScal(mRenderTex,mTex_Title,0,.8,1.4,mFinalAnim.ta);
					DrawTransScal(mRenderTex,mTex_Browse,0,.35,1.4,mFinalAnim.text1A);
					DrawTransScal(mRenderTex,mTex_CashOn,0,-.2,1.4,mFinalAnim.text2A);
					DrawTransScal(mRenderTex,mTex_Download,0,-.6,mSel===2?1.5:1.4,mFinalAnim.ca);
					DrawTransScal(mRenderTex,mTex_PlayAgain,0,-.85,mSel===1?1.5:1.4,mFinalAnim.pa);
				}
				TWEEN.update();
				// DrawTransScal(mRenderTex,mTex_ShopBtn,0,-.85,mSel===1?.9:1,1);
				break;
		}
		Counter++;
	}
	resize (gameSize, baseSize, displaySize, resolution)
    {
        // const width = gameSize.width;
        // const height = gameSize.height;

        // this.updateCamera();
    }
	// updateCamera ()
    // {
    //     const camera = this.cameras.main;
    //     camera.setViewport(x, y, this.sizer.width, this.sizer.height);
    //     camera.setZoom(Math.max(scaleX, scaleY));
    //     camera.centerOn(320, 480);

    //     this.backgroundScene.updateCamera();
    // }
	// getZoom ()
    // {
    //     return this.cameras.main.zoom;
    // }
}

function HandleEvent(events, pointer) {
	switch (GameScreen) {
		case GAMESPLASH:
			HandleSplash(events, pointer);
			break;
		case GAMETUT:
			HandleTut(events, pointer);
			break;
		case GAMEPLAY:
			HandleGame(events, pointer);
			break;
		case GAMEFINAL2:
		case GAMEFINAL:
		// case GAMECONG:
			 mSel=0;

			if(GameScreen === GAMEFINAL && CircRectsOverlap(0,-.7,floatWidth(mTex_Download.width)*.5,floatHeight(mTex_Download.height)*.4,screen2worldX(pointer.x),screen2worldY(pointer.y),.025)){
					mSel = 2;
			}
			if(CircRectsOverlap(0,-.9,floatWidth(mTex_Start.width)*.5,floatHeight(mTex_Start.height)*.4,screen2worldX(pointer.x),screen2worldY(pointer.y),.025)){
			 mSel = 1;
			}
			if(events ===2)
			{
				 if(mSel===1)
				 {
					switch(GameScreen)
					{
						case GAMECONG:
							HideBurst();
							GameScreen = GAMEFINAL;
							CallFinaScrAnim();
							break;
						case GAMEFINAL:
							// GameScreen = GAMEFINAL2;
							rendmiseCard();
							// CallFinaScrAnim();
							mTutCnt=0;
							HideBurst();
							GameScreen = GAMETUT;
							GameScreen = GAMETUT;
							mTutCnt =1;sendGamePlay=0;coinAnim = {x:0,y:.78,a:1,cont:0};
							bgLoad = 0;
							// GameReset();
							break;
						case GAMEFINAL2:
							mTutCnt=0;
							HideBurst();
							bgLoad = 0;
							GameReset();
							break;
					}
				 }
				 if(mSel == 2){
					 FbPlayableAd.onCTAClick();
				 }
				 mSel=0;
			}
			break;
	}
}
let mFinalAnim={};
function CallFinaScrAnim()
{
	Counter =0;
	mFinalAnim ={bg:0,ta:0,text1A:0,text2A:0,ca:0,pa:0};
	new TWEEN.Tween(mFinalAnim).to({bg:GameScreen === GAMEFINAL?1:0},500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mFinalAnim).to({ta:1},500).delay(500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mFinalAnim).to({text1A:1},500).delay(700).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mFinalAnim).to({text2A:1},500).delay(900).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mFinalAnim).to({ca:1},500).delay(1000).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mFinalAnim).to({pa:1},500).delay(1100).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
}


let mSplashAnim ={bg:0,ta:0,txtA:0,txtB:0,rx:-1.5,sa:0,scal:1.3};
function CallSplashAnim()
{
	mSplashAnim ={bg:0,ta:0,txtA:0,txtB:0,rx:-1.5,sa:0,scal:1.3};
	new TWEEN.Tween(mSplashAnim).to({bg:1},500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mSplashAnim).to({ta:1},1000).delay(500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mSplashAnim).to({txtA:1},1000).delay(1000).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mSplashAnim).to({txtB:1},1000).delay(1500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mSplashAnim).to({sa:1},1000).delay(2000).easing(TWEEN.Easing.Quadratic.In).onUpdate(() => {}).onComplete(() => {
		new TWEEN.Tween(mSplashAnim).to({scal:1.4},500).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Cubic.InOut).onUpdate(()=>{}).start();
	}).start();
	new TWEEN.Tween(mSplashAnim).to({rx:.41},1000).delay(3000).easing(TWEEN.Easing.Exponential.Out).onUpdate(()=>{}).start();
}

function DrawSplash()
{

	DrawTransScal(mRenderTex,mTex_Bg,0,-.470,1.2,mSplashAnim.bg);
	// DrawTransScal(mRenderTex,mTex_RoundRect,mSplashAnim.rx,.154,1.4,1);
	DrawTransScal(mRenderTex,mTex_StartTxt,0,.55,1.4,mSplashAnim.txtA);
	DrawTransScal(mRenderTex,mTex_TxtHelp,0,.32,1.4,mSplashAnim.txtB);
	DrawTransScal(mRenderTex,mTex_Title,0,.8,1.4,mSplashAnim.ta);
	DrawTransScal(mRenderTex,mTex_Start,0,-.85,mSel===1?1.5:mSplashAnim.scal,mSplashAnim.sa);
	TWEEN.update();
}
function HandleSplash(event,pointer)
{
	mSel =0;
	if(CircRectsOverlap(0,-.85, floatWidth(mTex_Start.width)*.5,floatHeight(mTex_Start.height)*.45,screen2worldX(pointer.x),screen2worldY(pointer.y),.01)){
		mSel = 1;//Play
	}

	if(event ===2)
	{
		switch(mSel)
		{
			case 1:
			// CallCong();
				GameScreen = GAMETUT;
				mTutCnt = 1;
				bgLoad = 0;
				 // GameReset();
				 // GameScreen= GAMEFINAL;
				break;
		}
		mSel=0;
	}
}
let mCongAnim={};
let sendGamePlay = 0;
let coinAnim = {x:0,y:.78,a:1,cont:0};
let bgLoad = 0;
function DrawTutorial()
{
	DrawTextureSS(mTex_MobileBg,0,MOBY,1.4,1.38);
	DrawTextureSS(mTex_TimeBar,0,.92,1.4,1.3,mTimerAlpha); // Game Timer
	mTex_FillBar.setCrop(0,0,0,mTex_FillBar.height);
	DrawTextureSS(mTex_FillBar,0,.92,1.4,1.3,mTimerAlpha); // Game Timer
	let rupee =  "\u20B9";
	DrawTextColor(mRenderTex,mGameFont1,""+0,-.81,.87,100,100,100,1);
	DrawTextColor(mRenderTex,mGameFont2,""+4000 ,.88,.87,100,100,100,1);
	DrawTextColor(mRenderTex,mArialFont,rupee+"",-.84,.87,100,100,100,1);
	DrawTextColor(mRenderTex,mArialFont,rupee+"",.62,.87,100,100,100,1);
	for(let i=0;i<4;i++){
		DrawTransScal(mRenderTex,mTex_WhiteBox,-.68+i*.45,.62,1.4,1);
		DrawTransScal(mRenderTex,mTex_ProfilePic[i],-.68+i*.45,.72,1,1);
		DrawArc(mArc,-.68+i*.45,.72,52,1,0xf25eeb,8,0,350-i*15); //proflie timer
		let no=i;
		if(i==1)
		   no=2;
		if(i===2)
		   no=1;
		DrawTextureSS(mTex_Products[no],-.68+i*.45,.52,.7,.7,1);
	}
	for(let i=0;i<6;i++)
	{

		let xx = -.41+(i%2)*.83;
		let yy = -.29+.11-parseInt(i/2)*.42
		DrawTransScal(mRenderTex,mTex_Card,xx,yy,1.4,1);
		// DrawTransScal(mRenderTex,mTex_CardSel,mCard[i].x,mScrollY+mCard[i].y,1.4,1);
		DrawTransScal(mRenderTex,mTex_Products[i],xx,yy,1,1);
	}
	DrawTransScal(mRenderTex,mTex_BgTrans,0,0,3.4,.8);

	if(mTutCnt===1 || mTutCnt===2)
	{
	let sel=2;
	if(sendGamePlay > 0){
		DrawTransScal(mRenderTex,mTex_GreenBox,-.68+sel*.45,.62,1.4,1-sendGamePlay*.01);
		sendGamePlay+=2;
		coinAnim.a -=.02;
		coinAnim.x-=.001;
		coinAnim.y+=.002;
		DrawTransScal(mRenderTex,mTex_ScoreCir,coinAnim.x,coinAnim.y,.7,coinAnim.a);
		DrawTextColorScal(mRenderTex,mGameFont,"+"+COINS,coinAnim.x,coinAnim.y,.48,255,255,255,coinAnim.a);
		if(sendGamePlay > 80){
			mTutCnt = 0;
		}

	}else {
		DrawTransScal(mRenderTex,mTex_WhiteBox,-.68+sel*.45,.62,1.4,1);
	}

	if(bgLoad === 4){
		document.body.style.backgroundImage = "url()";
	}
	bgLoad++;
	DrawTransScal(mRenderTex,mTex_ProfilePic[5],-.68+sel*.45,.72,1,1);
	DrawArc(mArc,-.68+sel*.45,.72,52,1,0xf25eeb,8,0,350-sel*15); //proflie timer
	DrawTextureSS(mTex_Products[14],-.68+sel*.45,.52,.7,.7,1);
		let txt1 = "Tap on the product below.";
		let txt2 = "Match it with the product\non the profile list above\nto resell it.";
		DrawTextColorScal(mRenderTex,mGameFont,mTutCnt === 1 ? txt1:txt2,.25,.2,.7,255,255,255,1);
		// DrawTransScal(mRenderTex,mTex_tut1,.25,.2,1.2,1);
		if(mTutCnt === 1)
			DrawTransScal(mRenderTex,mTex_Arrow,.25,.07,-1.4,1);
		else
			DrawTransScal(mRenderTex,mTex_Arrow,.25,.33,1.4,1);

		sel=1;
		let xx = 0.42;
		let yy = -.18;
		DrawTransScal(mRenderTex,mTex_Card,xx,yy,1.4,1);
		DrawTransScal(mRenderTex,mTex_CardSel,xx,yy,1.4,1);
		DrawTransScal(mRenderTex,mTex_Products[14],xx,yy,mTutCnt === 1 ? 1:1.4,1);

	}

	if(mTutCnt===0)
	{
		DrawTextureSS(mTex_ScoreBar,0,.9,1,.6,1);
		DrawTextureSS(mTex_TimeBar,0,.92,1.4,1.3,mTimerAlpha); // Game Timer
		mTex_FillBar.setCrop(0,0,coinAnim.cont,mTex_FillBar.height);
		if(coinAnim.cont <80){
			coinAnim.cont+=5;
		}
		DrawTextureSS(mTex_FillBar,0,.92,1.4,1.3,mTimerAlpha); // Game Timer
		DrawTextColor(mRenderTex,mGameFont1,""+400,-.81,.87,100,100,100,1);
		DrawTextColor(mRenderTex,mGameFont2,""+4000 ,.88,.87,100,100,100,1);
		DrawTextColor(mRenderTex,mArialFont,rupee+"",-.84,.87,100,100,100,1);
		DrawTextColor(mRenderTex,mArialFont,rupee+"",.62,.87,100,100,100,1);

		// let txt = "Resell more products\nto earn more profits";
		// DrawTextColorScal(mRenderTex,mGameFont,txt,0,.68,.7,255,255,255,1);
		DrawTransScal(mRenderTex,mTex_tut2,.0,.68,1.2,1);
		DrawTransScal(mRenderTex,mTex_Arrow,0,.78,1.4,1);
		DrawTransScal(mRenderTex,mTex_Continue,0,-.85,mSel===1?1.5:1.4,1);
	}


}
function HandleTut(event,pointer)
{
	mSel =0;
	let sel=2;
	if(mTutCnt===0 && CircRectsOverlap(0,-.85, floatWidth(mTex_Start.width)*.5,floatHeight(mTex_Start.height)*.45,screen2worldX(pointer.x),screen2worldY(pointer.y),.01)){
		mSel = 1;//Play
	}
	if(mTutCnt===1 && CircRectsOverlap(0.42,-.18, floatWidth(mTex_Card.width)*.5,floatHeight(mTex_Card.height)*.45,screen2worldX(pointer.x),screen2worldY(pointer.y),.01)){
		mSel = 2;//Play
	}
	if(sendGamePlay===0&&mTutCnt===2 && CircRectsOverlap(-.68+sel*.45,.62, floatWidth(mTex_WhiteBox.width)*.5,floatHeight(mTex_WhiteBox.height)*.45,screen2worldX(pointer.x),screen2worldY(pointer.y),.01)){
		mSel = 3;//Play
	}

	if(event ===2)
	{
		switch(mSel)
		{
			case 1:
				mTutCnt++;
				if(mTutCnt ===2)
				{
				  GameReset();
				}
				GameReset();
				break;
				case 2:
				mTutCnt = 2;
				break;
				case 3:
				sendGamePlay = 1;
				// GameReset();
				break;
		}
		mSel=0;
	}
}
function CallCongAnim()
{
	mCongAnim={ta:0,congA:0,popupS:0,text1A:0,text2A:0,text3A:0,text4A:0,downA:0};
	new TWEEN.Tween(mCongAnim).to({ta:1},1000).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({congA:1},1000).delay(500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({popupS:1},1000).delay(700).easing(TWEEN.Easing.Bounce.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({text1A:1},1000).delay(1200).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({text2A:1},1000).delay(1500).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({text3A:1},1000).delay(1700).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({text4A:1},1000).delay(1900).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
	new TWEEN.Tween(mCongAnim).to({downA:1},1000).delay(2100).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{}).start();
}
function DrawCong()
{
	let rupee =  "\u20B9";
	let smfont = 1.0;
	let bigfont = 2.3;
	let val = mCorrectItem*COINS;
	DrawTransScal(mRenderTex,mTex_Title,0,.8,1.4,mCongAnim.ta);
	if(mCorrectItem > 0)
		DrawTransScal(mRenderTex,mTex_CongTxt,0,.5,1.4,mCongAnim.congA);
	else
		DrawTransScal(mRenderTex,mTex_Try,0,.5,1.4,mCongAnim.congA);
	DrawTransScal(mRenderTex,mTex_PopUp,0,-.2,mCongAnim.popupS,1);
	let txt = "Priya has successfully\nearned profits of";
	let txt0 = "Priya has earned\nprofits of";

	DrawTextColorScal(mRenderTex,mGameFont,val>0?txt:txt0,0,.08,smfont,44,22,93,mCongAnim.text1A);

	// mCorrectItem =20;

	let strs = val+"";
	let len =  Math.abs(strs.length);
	if (len<=1)
		len =1.5;
	let dx = floatWidth(45);
	DrawTextColorScal(mRenderTex,mArialFont,rupee+"",0-(dx*len),-.10,bigfont,44,22,93,mCongAnim.text2A);
	DrawTextColorScal(mRenderTex,mGameFont3,mCorrectItem*COINS +"",0,-.09,bigfont,44,22,93,mCongAnim.text2A);
	txt = "by reselling";
	// DrawTextColorScal(mRenderTex,mGameFont,txt,0,-.21,smfont,44,22,93,mCongAnim.text3A);
	DrawTransScal(mRenderTex,mTex_txt_Res,0,-.22,1.4,mCongAnim.text3A);
	DrawTextColorScal(mRenderTex,mGameFont3,""+mCorrectItem +(mCorrectItem == 1 ?" product":" products"),0,-.38,bigfont,44,22,93,mCongAnim.text4A);



	txt = "on Meesho ";
	DrawTextColorScal(mRenderTex,mGameFont,txt,0,-.53,smfont,44,22,93,mCongAnim.text4A);
	if(Counter > 300){
		HideBurst();
		GameScreen = GAMEFINAL;
		CallFinaScrAnim();
		document.body.style.backgroundImage = "url("+common_bg+")";
	}
	// DrawTransScal(mRenderTex,mTex_Continue,0,-.85,mSel===1?1.5:1.4,mCongAnim.downA);

	TWEEN.update();
}
function DrawGamePlay()
{

	DrawTextureSS(mTex_TimeBar,0,mTimeBarY,1.4,1.3,mTimerAlpha); // Game Timer
	DrawTextureSS(mTex_FillBar,0,mTimeBarY,1.4,1.3,mTimerAlpha); // Game Timer

	let rupee =  "\u20B9";
	DrawTextColor(mRenderTex,mGameFont1,""+mUserBonus,-.81,.87,100,100,100,mTextAlpha);
	DrawTextColor(mRenderTex,mGameFont2,""+mTotalBonus,.88,.87,100,100,100,mTextAlpha);
	DrawTextColor(mRenderTex,mArialFont,rupee+"",-.84,.87,100,100,100,mTextAlpha);
	DrawTextColor(mRenderTex,mArialFont,rupee+"",.62,.87,100,100,100,mTextAlpha);
	for(let i=0;i<mProFile.length;i++)
	{
		if((mProFile[i].mFullTime/mProFile[i].mTimer)<5 && mProFile[i].mCorrect ===0)
			mProFile[i].mCorrect =3;
		if(mProFile[i].x>-1)
		{
			switch(mProFile[i].mCorrect)
			{
				case 0:
					DrawTransScal(mRenderTex,mTex_WhiteBox,mProFile[i].x,mProFile[i].y,1.4,1);
					break;
				case 1:
					DrawTransScal(mRenderTex,mTex_GreenBox,mProFile[i].x,mProFile[i].y,1.4,mProFile[i].mFadAnim);
					break;
				case 2:
					DrawTranScalR(mTex_RedBox,mProFile[i].x,mProFile[i].y,1.4,mProFile[i].mFadAnim,mProFile[i].mNodege);
					break;
				case 3:
					 if(mProFile[i].mAniCnt%3==0)
						mProFile[i].mBlink++;
					  if(mProFile[i].mBlink%3==0)
					  	 	DrawTransScal(mRenderTex,mTex_RedBox,mProFile[i].x,mProFile[i].y,1.4,1);
					mProFile[i].mAniCnt++;
					break;
			}
		}
		// if(mProFile[i].mBlink %3==0)
		{
			DrawTransScal(mRenderTex,mProFile[i].mImgdp,mProFile[i].x,mProFile[i].y+.1,1,1);
			DrawArc(mArc,mProFile[i].x,mProFile[i].y+.1,52,1,0xf25eeb,8,0,mProFile[i].mFullTime); //proflie timer
			if(mProFile[i].mItem !=null)
				DrawTextureSS(mTex_Products[mProFile[i].mItem.no],mProFile[i].mItem.x,mProFile[i].mItem.y,.7,.7,1);
		}

	}
	for(let i=0;i<mProFile.length;i++)
	{
		if(mProFile[i].sx>-1 && mProFile[i].sx<1)
		{
			DrawTransScal(mRenderTex,mTex_ScoreCir,mProFile[i].sx,mProFile[i].sy,.7,mProFile[i].sa);
			DrawTextColorScal(mRenderTex,mGameFont,"+"+COINS,mProFile[i].sx-.005,mProFile[i].sy,.48,255,255,255,mProFile[i].sa);
		}
	}
	DrawTextureSS(mTex_MobileBg,mMobileX,mMobileY,1.4,1.38);
	DrawTextColor(mRenderTex,mGameFont,"Collections",0,mMobileY+.38,100,100,100,1);
	for(let i=0;i<mCard.length;i++)
	{

		DrawTransScal(mRenderTex2,mTex_Card,mCard[i].x,moveScr.y+mScrollY+mCard[i].y,1.4,1);
		if(mCard[i].touch===HoldTime)
			DrawTransScal(mRenderTex2,mTex_CardSel,mCard[i].x,moveScr.y+mScrollY+mCard[i].y,1.4,1);
		if(mCard[i].mItem !=null)
		{
			DrawTransScal(mRenderTex2,mTex_Products[mCard[i].mItem.no],mCard[i].mItem.x,moveScr.y+mScrollY+mCard[i].mItem.y,1,mCard[i].touch===HoldTime?.01:1);

		}
	}
	if(mItemDrag !=null && mItemDrag !==undefined)
	{
		if(mItemDrag.no !=undefined)
			DrawTransScal(mRenderTex3,mTex_Products[mItemDrag.no],mItemDrag.x,mItemDrag.y,1.45,1);

		// DrawTextColor(mGameFont,"Item"+mItemDrag.no,0,Card.mMobileY+.35,100,100,100,1);
	}

	// mScrollY += mScrollVY;
	// mScrollVY = 0;

	if(mScrollY<mBottomY)
	{
		mScrollY  = mBottomY;
		mScrollVY = 0;
	}
	if(mScrollY>=mTopY)
	{
		mScrollY = mTopY;
		mScrollVY =0;
	}



	if(GameScreen === GAMEPLAY)
	{
		GameLogic();
	}
	TWEEN.update();
}
function CreateItem()
{
	if(mItemTouch>0)
	{
		if(mItemDrag ===null)
		{
			mItemDrag = new Item();
			mItemDrag.SetItem(mCard[mItemTouch-1].mItem.x,moveScr.y+mScrollY+mCard[mItemTouch-1].mItem.y,mCard[mItemTouch-1].mItem.no);
		}
		// mCard[i].touch++;
		// mItemTouch++;
	}
}
let mBonus ={dx:0};
function GameLogic()
{
	for(let i=0;i<mProFile.length;i++)
	{
		if((mProFile[i].mFullTime<=0)  && !mProFile[i].end)
		{

			// if(mProFile[i].mCorrect===1)
			// {
			// 	// if(mProFile[i].sa<.1)
			// 	{
			// 		mProFile[i].end = true;
			// 		FadCardAnim(i);
			// 	}
			// }
			// else
			{
				mProFile[i].end = true;
				RemoveCard(i);
			}
		}
	}
}
let mScrollY=0,mScrollVY=0,mScrollTY=0;
let isScroll=false;
function ScoreAnim(_no)
{
	let anim={x:mProFile[_no].x,y:mProFile[_no].y,a:1};
	new TWEEN.Tween(anim).to({x:0,y:mTimeBarY,a:0},1000).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() => {
		mProFile[_no].sx = anim.x;
		mProFile[_no].sy = anim.y;
		mProFile[_no].sa = anim.a;
		}).onComplete(() => {
	}).start();
	FadCardAnim(_no);
}
function HandleGame(event,pointer)
{
	if(event===0)
	{
		mSel=0;
		for(let i=0;i<mCard.length && mItemDrag === null;i++)
		{
			if(mScrollY+mCard[i].mItem.y<0)
			{
				if(CircRectsOverlap(mCard[i].mItem.x,mScrollY+mCard[i].mItem.y,floatWidth(mTex_Products[mCard[i].mItem.no].width)*.5,floatHeight(mTex_Products[mCard[i].mItem.no].height)*.6,screen2worldX(pointer.x),screen2worldY(pointer.y),.1)){
					mItemTouch = i+1;//itemSel
				}
			}
		}

		if(mItemDrag ===null && !isScroll)
		{
			mScrollTY = pointer.y;
			mov = screen2worldY(pointer.y);
		}

	}
	if(event===1)
	{

		// if(mItemDrag !=null && mItemTouch>=HoldTime)
		// {

		// 	mItemDrag.x = screen2worldX(pointer.x);
		// 	mItemDrag.y = screen2worldY(pointer.y);
		// }
		// else
		if(mItemDrag ===null)
		{
			moveScr.y =(screen2worldY(pointer.y)-mov);

			// let dis = Math.abs(mScrollTY-pointer.y);
			// if(!isScroll && dis>20)
			// {
			// 	mSel =0;
			// 	if (mScrollTY  > pointer.y) {
			// 		// mScrollVY = dis*.015;
			// 		mScrollTY = pointer.y;
			// 		let scroll = {y:mScrollY};
			// 		isScroll = true;
			// 		new TWEEN.Tween(scroll).to({y:mScrollY+.4},400).easing(TWEEN.Easing.Circular.Out).onUpdate(() => {
			// 				mScrollY =  scroll.y;
			// 			}).onComplete(() => {
			// 				isScroll = false;
			// 		}).start();
			// 	}
			// 	if (mScrollTY  < pointer.y) {
			// 			// mScrollVY = -dis*.015;
			// 			mScrollTY = pointer.y;
			// 			let scroll = {y:mScrollY};
			// 			isScroll = true;
			// 			new TWEEN.Tween(scroll).to({y:mScrollY-.4},400).easing(TWEEN.Easing.Circular.Out).onUpdate(() => {
			// 					mScrollY =  scroll.y;
			// 				}).onComplete(() => {
			// 					isScroll = false;
			// 			}).start();
			//
			// 	}
			// 	mItemDrag = null;
			// 	for(let i=0;i<mCard.length;i++)
			// 		mCard[i].touch=0;
			// 		mItemTouch =0;
			// }
		}
	}
	if(event ===2)
	{

		for(let i=0;i<mProFile.length && mItemDrag !=null;i++)
		{
			if(CircRectsOverlap(mProFile[i].x,mProFile[i].y,floatWidth(mTex_WhiteBox.width)*.45,floatHeight(mTex_WhiteBox.height)*.45,screen2worldX(pointer.x),screen2worldY(pointer.y),.05))
			{

					if(mProFile[i].mItem.no === mItemDrag.no)
					{
						mProFile[i].mBlink=0;
						mProFile[i].mCorrect =1;//Correct
						ScoreAnim(i);
						// mUserBonus +=COINS;
						mCorrectItem++;
						mUserBonus = mCorrectItem* COINS;

						Snd_Right.play();
						new TWEEN.Tween(mBonus).to({dx:mTimeBarDx*mUserBonus},500).easing(TWEEN.Easing.Quartic.Out).onUpdate(() => {
								mTex_FillBar.setCrop(-mBonus.dx,0,mBonus.dx,mTex_FillBar.height);}).onComplete(() => {
							if(mUserBonus>=mTotalBonus) // mTotalBonus
								CallCong();
						}).start();
					}
					else
					{
						mProFile[i].mCorrect =2;//Wrong
						mNodgeCnt =0;
						FadCardAnim(i);

					}
					mCard[mItemTouch-1].touch=0;
					mItemTouch=0;
					mItemDrag = null;
			}
		}
		if(mItemTouch>0&&Math.abs(moveScr.y)<0.05)
		{
			mCard[mItemTouch-1].touch++;
			if(mCard[mItemTouch-1].touch==HoldTime)
			{
				CreateItem();
			}
			if(mCard[mItemTouch-1].touch>HoldTime)
			{
				mCard[mItemTouch-1].touch =0;
				mItemTouch =0;
				mItemDrag = null;
			}
			mScrollY +=moveScr.y;
			moveScr.y =0;
		}else{
			new TWEEN.Tween(moveScr).to({y:moveScr.y+(moveScr.y>0?.08:-.08)},200).easing(TWEEN.Easing.Quartic.Out).onComplete(() => {
				mScrollY +=moveScr.y;
				moveScr.y =0;
			}).start();
		}
		isScroll = false;
		mSel=0;
		// mScrollY +=moveScr.y;
		// moveScr.y =0;

	}
}
let mNodgeCnt=0;
function NodgeAnim(_no,_ang)
{
		var nodge={ang:0};
		new TWEEN.Tween(nodge).to({ang:_ang},80).easing(TWEEN.Easing.Back.InOut).onUpdate(() => {
			mProFile[_no].mNodege = nodge.ang;
		}).onComplete(() => {
			if(mNodgeCnt<4)
				NodgeAnim(_no,mNodgeCnt==3?0:mProFile[_no].mNodege*-1);
			 else
			 	mProFile[_no].mCorrect=0;
			mNodgeCnt++;
	}).start();
}
function FadCardAnim(_no)
{
	var fad={a:0};
	new TWEEN.Tween(fad).to({a:1},500).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() => {
			mProFile[_no].mFadAnim = fad.a;
		}).onComplete(() => {
			if(mProFile[_no].mCorrect==1)
			 	RemoveCard(_no);
			else
			{
				Snd_Wrong.play();
				NodgeAnim(_no,-7);
			}

		}).start();
}
function RemoveCard(_no)
{
	if(GameScreen === GAMEPLAY)
	{
		mProFile.splice(_no,1);
		let _profile = AddNewProfile();
		mProFile.push(_profile);
		for(let i=_no;i<mProFile.length;i++)
		{
			if(mProFile[i].x>-.68)
			{
				let xx = {x:mProFile[i].x};
				new TWEEN.Tween(xx).to({x:ProfilePosX[i]},1000).delay(1000).easing(TWEEN.Easing.Quintic.Out).onUpdate(() => {
					mProFile[i].x = xx.x;
				// new TWEEN.Tween(mProFile[i]).to({x:mProFile[i].x-.45},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(() => {
					mProFile[i].mItem.x= mProFile[i].x;
					}).onComplete(() => {
				}).start();
			}
		}
	}
}

function checkisin(_itemno,no){
	for (var i = 0; i < mProFile.length; i++) {
		if(_itemno===mProFile[i].mItem.no){
			if(no<3)
				return checkisin((_itemno+1)%4,no);
			else
				return checkisin(5+((_itemno+1)%mTex_Products.length-5),no);

		}
	}
	return _itemno;
}
function AddNewProfile()
{
	if(GameScreen === GAMEPLAY)
	{
		mTotalProfile++;
		let obj  = new Profile();
		let no = mTotalProfile%mTex_ProfilePic.length;
		obj.SetProfile(1+(GetLastPos()*.45),.62,mTex_ProfilePic[no]);//GetLastPos()+.45
		obj.mItem = new Item();
		let _itemno=0;
		if(no<3)
			_itemno = RandomInt(0,4);
		else
			_itemno = RandomInt(5,mTex_Products.length-1);

		_itemno=checkisin(_itemno,no);
		obj.mItem.SetItem(obj.x,obj.y-.08,_itemno);
		return obj;
	}
}
function GetLastPos()
{
	let xx = -.68;
	let index = 0;
	if(mProFile.length>0)
		xx = mProFile[0].x;
	else
		return index;
	for(let i=0;i<mProFile.length;i++)
	{
		if(mProFile[i].x>xx)
		{
			xx = mProFile[i].x;
			index=i;
		}
	}
	return index;

}
let mTimeBarDx = .172;
let ProfilePosX=[];
function GameReset()
{

	GameScreen = GAMEBEGIN;
	Snd_BG.volume=1;
	Snd_BG.loop = true;
	Snd_BG.play();
	moveScr.y =0;

	mBonus ={dx:mTimeBarDx*mUserBonus};
	mUserBonus=400;
	mItemDrag = null;
	mScrollY=0,mScrollVY=0,mScrollTY=0;
	isScroll=false;
	mTutCnt 	 = 0;
	mGameTime    = 60;
	mCorrectItem = 1;
	mTex_FillBar.setCrop(0,0,0,mTex_FillBar.height);
	mTex_FillBar.setCrop(0,0,80,mTex_FillBar.height);
	mTimeBarWidth = mTex_FillBar.displayWidth;
	mTimeBarDx = .172;
	mTimeBarY 	  = 1.2;
	mTimerAlpha   = .5;
	mTextAlpha	  =  0;


	var yy={y:mTimeBarY};
	new TWEEN.Tween(yy).to({y:.92},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(() => {
			mTimeBarY = yy.y;
		}).onComplete(() => {
			let alpha = {a:mTimerAlpha,a2:0}
			new TWEEN.Tween(alpha).to({a:1,a2:1},1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(() => {
				mTimerAlpha = alpha.a;
				mTextAlpha  = alpha.a2;
			}).onComplete(() => {
		}).start();
	}).start();

	for(let i=0;i<mProFile.length;i++)
		mProFile.splice(i,1);

	mProFile=[];
	ProfilePosX=[];
	mProfileAnim =0;
	mTotalProfile =0;
	for(let i=0;i<4;i++)
	{
		mProFile[i] = new Profile();
		let no = i%mTex_ProfilePic.length;
		mProFile[i].SetProfile(2+i*.45,.62,mTex_ProfilePic[no]);
		mProFile[i].mItem = new Item();
		let _itemno=0;
		if(no<3)
			_itemno = RandomInt(0,4);
		else
			_itemno = RandomInt(5,mTex_Products.length-1);


    mProFile[i].mItem.SetItem(mProFile[i].x,mProFile[i].y-.1,_itemno);
		ProfilePosX[i] = -.68+i*.45;
	}
	ProfileAnim();
	mMobileY = -2;
	var yy1={y:mMobileY};
	new TWEEN.Tween(yy1).to({y:MOBY}
		,1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(() => {
			mMobileY = yy1.y;
			for(let i=0;i<mCard.length;i++)
			{
				mCard[i].SetCard((mMobileX-.41)+(i%2)*.83,(mMobileY+.11)-parseInt(i/2)*.42);
				if(mCard[i].mItem ===null)
					mCard[i].mItem = new Item();
				mCard[i].mItem.SetItem(mCard[i].x,mCard[i].y,crd[i%mTex_Products.length]);
			}
		}).onComplete(() => {
			mBottomY=0;
			mTopY = Math.abs(mCard[mCard.length-3].y);

	}).start();

}

function ProfileAnim()
{
	if(mProfileAnim<mProFile.length)
	{
				let _itemno =0;
				if(mProfileAnim<3)
					_itemno = RandomInt(0,4);
				else
					_itemno = RandomInt(5,mTex_Products.length-1);
			_itemno=checkisin(_itemno,mProfileAnim);
			new TWEEN.Tween(mProFile[mProfileAnim]).to({x:-.68+mProfileAnim*.45},500).easing(TWEEN.Easing.Quadratic.Out).onUpdate(() => {
				mProFile[mProfileAnim].mItem.SetItem(mProFile[mProfileAnim].x,mProFile[mProfileAnim].y-.08,_itemno);
			if(mProfileAnim===1)
			{
				if(mTimeInterVal !=null)
					clearInterval(mTimeInterVal);
			 	GameScreen = GAMEPLAY;
				 StartGameTime();
			}
		}).onComplete(()=>{
			mProfileAnim++;
			mTotalProfile++;
			ProfileAnim();
		}).start();
	}
}

let mTimeInterVal=null;
function StartGameTime()
{
	mTimeInterVal = setInterval(()=>{
		mGameTime--
		for(let i=0;i<mProFile.length;i++)
		{
			if(Math.abs(mProFile[i].x - ProfilePosX[i])<.01)
			{
				new TWEEN.Tween(mProFile[i]).to({mFullTime:mProFile[i].mFullTime-mProFile[i].mTimeInc},100).easing(TWEEN.Easing.Quadratic.Out).onUpdate(() => {
						}).onComplete(() => {
				}).start();
			}
		}
		if(mGameTime<=0)
		{
			CallCong();
		}
	}, 1000);

}
function CallCong()
{
	Counter = 0;
	CallCongAnim();
	clearInterval(mTimeInterVal);
	GameScreen = GAMECONG;
	Snd_BG.stop();
	Snd_BG.loop= false;
	let t_out = setTimeout(() => {
		if(mCorrectItem > 0)
			CallBurst(mScene);
		clearTimeout(t_out);
	},1500);

	if(mCorrectItem > 0){
		Snd_Cheer.play();
	}else {
		Snd_fail.play();
	}

	mOver={a:.1};
	// confetti({ particleCount:300, spread:120,startVelocity:25,gravity:.5,ticks:500, origin: { x: .5, y:0} });
	new TWEEN.Tween(mOver).to({a:1},1000).easing(TWEEN.Easing.Quintic.Out).onUpdate(() => {
		}).onComplete(() => {
	}).start();
}
function HideBurst()
{
	mRed_ribbon.scale = mYellow_ribbon.scale   = mBlue_ribbon.scale  = mPink_ribbon.scale = 0;
	mRed_ribbon.alpha =  mYellow_ribbon.alpha  = mBlue_ribbon.alpha = mPink_ribbon.alpha= 0;
	mRed_ribbon.x = XPos(outPos);
	mYellow_ribbon.x = XPos(outPos);
	mBlue_ribbon.x = XPos(outPos);
	mPink_ribbon.x = XPos(outPos);
}
function InitObj()
{
	for(let i=0;i<mTex_Products.length;i++)
	{
		mCard[i] = new Card();
		crd.push(i);
	}
	rendmiseCard();
}
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function DrawCircle(circle,x,y,radius,alpha,color,stroke)
{
	circle.radius = radius;
	circle.strokeColor = color
	circle.setStrokeStyle(stroke,color,alpha);
	circle.displayWidth = 100;
	circle.displayHeight  = 100;
	circle.top -=1;
	circle.left-=1;
	// circle.setFillStyle();
	circle.setFillStyle(color, alpha);
	mRenderTex.draw(circle,XPos(x),YPos(y));

	// mGraphics.lineStyle(8, "0xff55fa",1);
		// mGraphics.beginPath();
		// mGraphics.arc(XPos(mProFile[i].x), YPos(mProFile[i].y+.1),mProFile[i].mRad,Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(mProFile[i].mFull+269),false);
		// mGraphics.strokePath();
		// mGraphics.closePath();
		// mProFile[i].mTimer--;

}
function DrawArc(arc,x,y,radius,alpha,color,stroke,startAngle,endAngle)
{
	arc.radius =radius;
	arc.startAngle = startAngle;
	arc.endAngle  = endAngle ;
	arc.setStrokeStyle(stroke,color,alpha);
	arc.setFillStyle();
	arc.angle  = -90;
	arc.scaleX = 1;
	arc.scaleY = -1;
	arc.closePath =false;
	arc.anticlockwise = false;

	mRenderTex.draw(arc,XPos(x),YPos(y));

}
function DrawNumber(no,x, y) {
	let dx = floatWidth(mTex_Font[0].width*.5);
	let strs = "" + no;
	for (let i = 0; i < strs.length; i++) {
		let k = (strs.charAt(i));
		if (k >= 0 && k < mTex_Font.length)
			DrawTexture(mTex_Font[k],x + i * dx, y);
			// mTex_Font[k].drawPos( x + i * dx, y);
	}
}
function DrawText(Font,strs, x, y) {
	Font.setText(strs);
	var color = rgbToHex(255, 255, 255);
	Font.setColor(color);
	Font.alpha = 1;
	Font.angle = 0;
	Font.setScale(1);
	mRenderTex.draw(Font, XPos(x), YPos(y));
}
function DrawTextR(Font,strs, x, y,ang) {
	Font.setText(strs);
	var color = rgbToHex(255, 255, 255);
	Font.setColor(color);
	Font.alpha = 1;
	Font.angle = ang;
	Font.setScale(1);
	mRenderTex.draw(Font, XPos(x), YPos(y));
}
function DrawTextScalAlpha(Font, strs, x, y, s,a) {
	Font.setText(strs);
	var color = rgbToHex(255, 255, 255);
	Font.setColor(color);
	Font.alpha = a;
	Font.setScale(s);
	mRenderTex.draw(Font, XPos(x), YPos(y));
}

function DrawTextColor(render,Font, strs, x, y, r, g, b, a) {
	var color = rgbToHex(r, g, b);
	Font.setColor(color);
	Font.setText(strs);
	Font.alpha = a;
	Font.setScale(1);
	render.draw(Font, XPos(x), YPos(y));
}
function DrawTextColorScal(render,Font, strs, x, y,s,r,g,b,a) {
	Font.setText(strs);
	var clr = rgbToHex(r, g, b);
	Font.setColor(clr);
	Font.alpha = a;
	Font.setScale(s);
	render.draw(Font, XPos(x), YPos(y));
}
function DrawTexture(img, x, y) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = 1;
	img.angle = 0;
	img.setScale(1,1);
	mRenderTex.draw(img, XPos(x), YPos(y));

}
function DrawTextureSS(img, x, y, sx, sy,a) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = a;
	img.angle = 0;
	img.flipX = false;
	img.scaleX = sx;
	img.scaleY = sy;
	mRenderTex.draw(img, XPos(x), YPos(y));
}
function DrawTransScal(rander,img, x, y, s, t) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = t;
	img.angle = 0;
	img.setScale(s,s);
	rander.draw(img, XPos(x), YPos(y));
}
function DrawTextureFlip(img, x, y,isflipX, isflipY) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = 1;
	img.setScale(1,1);
	img.flipX = isflipX;
	img.flipY = isflipY;
	img.angle = 0;
	mRenderTex.draw(img, XPos(x), YPos(y));

}
function DrawTranScalR(img, x, y, s, t, r) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = t;
	img.setAngle(r);
	img.setScale(s,s);
	mRenderTex.draw(img, XPos(x), YPos(y));
}
function DrawTextureR(img, x, y, r) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = 1;
	img.setScale(1,1);
	img.flipX = false;
	img.flipY = false;
	img.angle = r;

	mRenderTex.draw(img, XPos(x), YPos(y));
}
function DrawTexColor(img, x, y, r, g, b) {
	var hex = (r * 0x010000) + (g * 0x000100) + (b * 0x000001);
	img.tint = hex;
	img.alpha=1;
	img.angle = 1;
	img.setScale(1,1);
	mRenderTex.draw(img, XPos(x), YPos(y));

}
function DrawTexColorScal(img, x, y, r, g, b,sx,sy) {
	var hex = (r * 0x010000) + (g * 0x000100) + (b * 0x000001);
	img.setTint(hex);
	img.alpha=1;
	img.angle = 1;
	img.setScale(sx,sy);
	mRenderTex.draw(img, XPos(x), YPos(y));

}
function DrawTextureRS(img, x, y, s, r) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.alpha = 1;
	img.angle = r;
	img.setScale(s,.5);
	mRenderTex.draw(img, XPos(x), YPos(y));
}
function DrawTextureRTS(img, x, y, s, ang, r, g, b, alpha) {
	var hex = ((r * 255) * 0x010000) + ((g * 255) * 0x000100) + ((b * 255) * 0x000001);
	img.tint = hex;
	img.alpha = alpha;
	img.angle = ang;
	img.setScale(s,s);
	mRenderTex.draw(img, XPos(x), YPos(y));
}

function DegreeToRadian(d) {
	var r = d * (Math.PI / 180);
	return r;
}
function RadianToDegree(r) {
	var d = r * (180 / Math.PI);
	return d;
}
function GetAngle(d, e) {

	if (d == 0)
		return e >= 0 ? Math.PI / 2 : -Math.PI / 2;
	else if (d > 0)
		return Math.atan(e / d);
	else
		return Math.atan(e / d) + Math.PI;

}
function RandomBoolean() {
	let r = RandomInt(0,1);
	if (r < 1)
		return false;
	else
		return true;
}
function RandomInt(min, max) {
	// return Math.floor(Math.random() * (max - min + 1) + min);
	return Phaser.Math.Between(min, max);
}
function Dist(x1,y1,x2,y2){
	if(!x2) x2=0;
	if(!y2) y2=0;
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  }
function Randomfloat(min, max) {

	var rnd = Phaser.Math.RND;
	let value = rnd.frac();
	max = max - min;
	max = value % max;
	return (max + min);
}
function checkOverlap(spriteA, spriteB) {

	var boundsA = spriteA.getBounds();
	var boundsB = spriteB.getBounds();

	return Phaser.Rectane.varersects(boundsA, boundsB);
}
function CirCir(cx1, cy1, r1, cx2, cy2, r2) {
	var bVectMag = Math.sqrt(((cx1 - cx2) * (cx1 - cx2)) + ((cy1 - cy2) * (cy1 - cy2)));
	if (bVectMag < (r1 + r2))
		return true;
	return false;
}
function XPos(x) {
	return (((1 + x) * maxX) / 2);
}
function YPos(y) {
	return (((1 - (y)) * maxY) / 2);
}
function floatHeight(Height) {
	return (Height / maxY) * 2;
}
function floatWidth(Width) {
	return (Width / maxX) * 2;
}
function screen2worldX(a) {
	c = ((a / maxX) - 0.5) * 2;
	return c;
}
function screen2worldY(a) {
	c = ((a / maxY) - 0.5) * (-2);
	return c;
}
function Rect2RectIntersection(ax,ay, adx, ady, bx, by,bdx,bdy)
{
	ax -= adx/2;
	ay += ady/2;
	bx -= bdx/2;
	by += bdy/2;
	if( ax+adx > bx  && ay-ady < by && bx+bdx > ax && by-bdy< ay)
	{
		return true;
	}
	return false;
}
function Rect2Rectvarersection(ax, ay, adx, ady, bx, by, bdx, bdy) {
	ax -= adx / 2;
	ay += ady / 2;
	bx -= bdx / 2;
	by += bdy / 2;
	if (ax + adx > bx && ay - ady < by && bx + bdx > ax && by - bdy < ay) {
		return true;
	}
	return false;
}
function CircRectsOverlap(CRX, CRY, CRDX, CRDY, centerX, centerY, radius) {
	if ((Math.abs(centerX - CRX) <= (CRDX + radius)) && (Math.abs(centerY - CRY) <= (CRDY + radius)))
		return true;

	return false;
}
function rendmiseCard(){
	crd.sort(compRan);
}
function compRan() {
  return 0.5 - Math.random();
}
