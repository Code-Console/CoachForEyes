const MAXH = 1920;
class Game {
    constructor() {
        this.init();
    }
    init() {
        const game = this;
        this.counter = 0;
        this.rad = 0;
        this.dis = 30;
        this.isResize = 0;
        this.mTex_fonts = Array(10);
        this.mTex_fScore = Array(10);
        this.mTex_fonts2 = Array(5);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x181f32);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, this.dis);//30
         this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.gameUI = new ThreeUI(this.renderer.domElement, MAXH);
        this.clock = new THREE.Clock();
        this.coords = new THREE.Vector2();
        this.mouse = new THREE.Vector2();
        this.diff = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.mSel = 0;
        this.queNo = 0;
        this.points = 0;
        this.AnsClicked = -1;
        this.AnsCounter = 0;
        this.userLife = 1;
        this.zoom = 0;
        this.lvl = 0;
        this.isCorrect = true;

        this.correctAns = 0;
        this.randQue = [0,1,2,3,4,5,6,7,8,9];
        this.randQue.sort(compRan);
        this.meshLoading = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshNormalMaterial() );
        this.meshLoading.position.set(0,0,0);
        // this.scene.add( this.meshLoading );


        this.gltf_Bat = null;
        this.gltf_Amit = null;
        this.gltf_AmitSit = null;
        const loder = new THREE.GLTFLoader();
        loder.load(STAGE_V01_GLTF,
            function ( gltf ) {
	            game.scene.add( gltf.scene);
                game.gltf_Bat = gltf.scene;
                game.gltf_Bat.scale.set(2,2,2);
                game.gltf_Bat.position.set(0,-5,0);
                game.gltf_Bat.visible = false;
                var object = gltf.scene;
                var animations = gltf.animations;
                if ( animations && animations.length ) {
                    game.mixer = new THREE.AnimationMixer( object );
                    for ( var i = 0; i < animations.length; i ++ ) {
                        var animation = animations[ i ];
                        animation.duration = 3;
                        var action = game.mixer.clipAction( animation );
                        action.play();
                    }
                }
            },function ( xhr ) {    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },function ( error ) {console.log( 'An error happened' +error);}
        );

        loder.load(SITTING_CLAP_GLTF,
            function ( gltf ) {
	            game.scene.add( gltf.scene);
                game.gltf_Amit = gltf.scene;
                game.gltf_Amit.scale.set(2,2,2);
                game.gltf_Amit.visible = false;
                game.gltf_Amit.rotation.set(0,-Math.PI*.5,0);
                game.gltf_Amit.position.set(4,-4.0,0);
                game.gltf_Amit.used = 0;


                var object = gltf.scene;
                game.animationsAmit = gltf.animations;
                if ( game.animationsAmit && game.animationsAmit.length ) {
                    game.mixerAmit = new THREE.AnimationMixer( object );
                    console.log('~~ game.mixerAmit.time ' +game.mixerAmit.time );
                    for ( var i = 0; i < game.animationsAmit.length; i ++ ) {
                        var animation = game.animationsAmit[ i ];

                        var action = game.mixerAmit.clipAction( animation );
                        console.log(game.mixerAmit);
                        console.log(i+' game.mixerAmit.time ' ,action );
                        action.play();
                    }
                }
            },function ( xhr ) {    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },function ( error ) {console.log( 'An error happened' +error);}
        );
    //     loder.load('assets/Sitting.gltf',
    //     function ( gltf ) {
    //         game.scene.add( gltf.scene);
    //         game.gltf_AmitSit = gltf.scene;
    //         game.gltf_AmitSit.scale.set(2,2,2);
    //         game.gltf_AmitSit.visible = false;
    //         game.gltf_AmitSit.rotation.set(0,-Math.PI*.5,0);
    //         game.gltf_AmitSit.position.set(3.3,-4.0,0);
    //         game.gltf_AmitSit.used = 0;
    //
    //
    //         var object = gltf.scene;
    //         game.animationsAmitSit = gltf.animations;
    //         if ( game.animationsAmitSit && game.animationsAmitSit.length ) {
    //             game.mixerAmitSit = new THREE.AnimationMixer( object );
    //             console.log('~~ game.mixerAmitSit.time ' +game.mixerAmitSit.time );
    //             for ( var i = 0; i < game.animationsAmitSit.length; i ++ ) {
    //                 var animation = game.animationsAmitSit[ i ];
    //
    //                 var action = game.mixerAmitSit.clipAction( animation );
    //                 console.log(game.mixerAmitSit);
    //                 console.log(i+' game.mixerAmitSit.time ' ,action );
    //                 action.play();
    //             }
    //         }
    //     },function ( xhr ) {    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    //     },function ( error ) {console.log( 'An error happened' +error);}
    // );


        this.mp3Crect = loadSound("correct",CORRECT_MP3);
        this.mp3Wrong = loadSound("wrong",WRONG_MP3);
        this.mp3Intro = loadSound("intro",INTRO_MP3);
        this.mp3Heart = loadSound('heart',HEART_MP3);
        this.mp3Heart.loop = true;
        this.mp3Heart.pCnt =0;


        AssetLoader.add.image64('LANDINGBG_64',LANDINGBG_64);
        AssetLoader.add.image64('LANDINGBG2_64',LANDINGBG2_64);
        AssetLoader.add.image64('MF2_64',MF2_64);
        AssetLoader.add.image64('LOGO_64',LOGO_64);
        AssetLoader.add.image64('PLAYNOW_64',PLAYNOW_64);
        AssetLoader.add.image64('I5050_64',I5050_64);
        AssetLoader.add.image64('AUDIANCE_POLL_64',AUDIANCE_POLL_64);
        AssetLoader.add.image64('CORRECTBG_64',CORRECTBG_64);
        AssetLoader.add.image64('INCORRECTBG_64',INCORRECTBG_64);
        AssetLoader.add.image64('NORMAL_64',NORMAL_64);
        AssetLoader.add.image64('POINTS_64',POINTS_64);
        AssetLoader.add.image64('QUESTION_64',QUESTION_64);
        AssetLoader.add.image64('AUDIANCE_BG_64',AUDIANCE_BG_64);
        AssetLoader.add.image64('POWER_64',POWER_64);
        AssetLoader.add.image64('PLAYAGAIN_64',PLAYAGAIN_64);
        AssetLoader.add.image64('LEARN_64',LEARN_64);
        AssetLoader.add.image64('GREATWORK_64',GREATWORK_64);
        AssetLoader.add.image64('ENDSCREENBG_64',ENDSCREENBG_64);
        AssetLoader.add.image64('CLOSE_64',CLOSE_64);
        AssetLoader.progressListener = function (progress) {console.log("progress = "+progress);};
        AssetLoader.load(function () {
            game.mTex_BG = loadUI(game.gameUI, 'LANDINGBG_64', 0, 0, 0);
            game.mTex_BGPlay = loadUI(game.gameUI, 'LANDINGBG2_64', 0, 0, 0);
            game.mTex_BGR = loadUIRect(game.gameUI, 0, 0, 100, 100, '#000000');
            game.mTex_logo = loadUI(game.gameUI, 'LOGO_64', 0, 0, 0);
            game.mTex_PlayNow = loadUI(game.gameUI, 'PLAYNOW_64', 0, 0, 10);
            game.mTex_5050 = loadUI(game.gameUI, 'I5050_64', 0, 0, 11);
            game.mTex_audiancePoll = loadUI(game.gameUI, 'AUDIANCE_POLL_64', 0, 0, 12);
            game.mTex_audiancePoll.aUsed = 1;
            game.mTex_5050.aUsed = 1;
            game.mTex_normal = [];
            game.mTex_in50 = [];
            for (let i = 0; i < 4; i++) {
                game.mTex_normal.push(loadUI(game.gameUI, 'NORMAL_64', 0, 0, i+1));
                game.mTex_normal[i].a50 = 1;
                game.mTex_normal[i].nApha = 0.01;
            }
            for (let i = 0; i < 4; i++) {
                game.mTex_in50.push(loadUI(game.gameUI, 'INCORRECTBG_64', 0, 0, 0));
            }
            game.mTex_correct = loadUI(game.gameUI, 'CORRECTBG_64', 0, 0, 0);
            game.mTex_incorrect = loadUI(game.gameUI, 'INCORRECTBG_64', 0, 0, 0);
            game.mTex_points = loadUI(game.gameUI, 'POINTS_64', 0, 0, 0);
            game.mTex_question = loadUI(game.gameUI, 'QUESTION_64', 0, 0, 0);

            game.mTex_endscreen = loadUI(game.gameUI, 'ENDSCREENBG_64', 0, 0, 0);
            game.mTex_greatwork = loadUI(game.gameUI, 'GREATWORK_64', 0, 0, 0);
            game.mTex_playagain = loadUI(game.gameUI, 'PLAYAGAIN_64', 0, 0, 10);
            game.mTex_learn = loadUI(game.gameUI, 'LEARN_64', 0, 0, 13);

            for (var i = 0; i < game.mTex_fonts.length; i++) {
                game.mTex_fonts[i] = createTexts(game.gameUI, "100", 20, "#fff", ThreeUI.anchors.center, ThreeUI.anchors.center, "center", "myfont2");
            }
            for (var i = 0; i < game.mTex_fScore.length; i++) {
                game.mTex_fScore[i] = createTexts(game.gameUI, "100", 20, "#fff", ThreeUI.anchors.center, ThreeUI.anchors.center, "center", "myfont2");
            }
            for (var i = 0; i < game.mTex_fonts2.length; i++) {
                game.mTex_fonts2[i] = createTexts(game.gameUI, "100", 20, "#fff", ThreeUI.anchors.center, ThreeUI.anchors.center, "center", "myfont");
            }
            game.rect = loadUIRect(game.gameUI, 0, 0, MAXH*4, MAXH, '#000000');

            game.mTex_audiance_bg = loadUI(game.gameUI, 'AUDIANCE_BG_64', 0, 0, 0);
            game.mTex_power = [];
            game.mTex_pFont = [];
            for (let i = 0; i < 4; i++) {
                game.mTex_power.push(loadUI(game.gameUI, 'POWER_64', 0, 0, 0));
                game.mTex_pFont.push(createTexts(game.gameUI, "100", 20, "#fff", ThreeUI.anchors.center, ThreeUI.anchors.center, "center", "myfont"));
                game.mTex_pFont[i].per =0;
                game.mTex_pFont[i].inc = 0;
            }
            game.mTex_close = loadUI(game.gameUI, 'CLOSE_64', 0, 0, 14);
            game.mTex_Sahi = loadUI(game.gameUI, 'MF2_64', 0, 0, 0);
            game.setScreen(GAMEMENU);
            // game.setScreen(GAMEOVER);
            game.start =1;
        });
        this.helper = new CannonHelper(this.scene);
        this.helper.addLights(this.renderer);
        document.addEventListener('keydown', dealWithKeyboard);
        if (isMobile.any()) {
        document.addEventListener('touchstart', e => { this.touchEvent(e, 0, 1); });
            document.addEventListener('touchmove', e => { this.touchEvent(e, 1, 1); });
            document.addEventListener('touchend', e => { this.touchEvent(e, 2, 1); });
        } else {
            document.addEventListener('mousedown', e => { this.touchEvent(e, 0, 0); });
            document.addEventListener('mousemove', e => { this.touchEvent(e, 1, 0); });
            document.addEventListener('mouseup', e => { this.touchEvent(e, 2, 0); });
        }
        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('blur', () => { this.visibility_change('hidden'); });
        window.addEventListener('focus',() => { this.visibility_change('visible'); });
        this.animate();
    }
    visibility_change(visibilityState){
        if (visibilityState === 'hidden') {
            if (GameScreen === GAMEPLAY){
                // mGame.myAudioBG.pause();
            }
        }else{
            if (GameScreen === GAMEPLAY){
                // mGame.myAudioBG.play();
            }
        }
    }
    Handle_Menu(clickval) {
    //    console.log(this.AnsClicked+" = clickval = "+clickval);
       if(clickval <= 4 && this.AnsClicked < 0 && this.mTex_audiance_bg.visible == false && this.counter > 3){
           this.AnsClicked = clickval-1;
           if(QUESTION[this.randQue[this.queNo]].correct==this.AnsClicked){
                this.points +=10*this.userLife;
                this.mp3Crect.play();
                this.correctAns++;
                this.isCorrect = true;
           }else{
                this.isCorrect = false;
               if(this.userLife<1){
                  this.points -=5;
                }
                this.points -=10;//*this.userLife;
                this.mp3Wrong.play();
           }
           this.userLife = 1;
           this.zoom = 0;
       }
       if(clickval == 10){
           this.setScreen(GAMEPLAY);
           this.mp3Crect.play();
           this.mp3Wrong.play();
           this.mp3Heart.play();
           this.mp3Crect.pause();
           this.mp3Wrong.pause();
           this.mp3Heart.pause();
           this.mp3Heart.pCnt =0;
           this.mp3Intro.play();
       }
       if(clickval == 13){
            callAds();
       }
       if(clickval == 11 && this.mTex_5050.aUsed == 1 && this.mTex_audiance_bg.visible == false && this.AnsClicked < 0){
            this.mTex_5050.aUsed = .5;
            var rands = [];
            for (let i = 0; i < 4; i++) {
                if(i != QUESTION[this.randQue[this.queNo]].correct)
                    rands.push(i);
            }
            console.log(rands);
            rands.sort(compRan);
            console.log(rands);
            this.mTex_normal[rands[0]].a50 = .5;
            this.mTex_normal[rands[1]].a50 = .5;
            // this.points -=5;
            this.userLife = .5;
        }
        if(clickval == 12 && this.mTex_audiancePoll.aUsed == 1 && this.AnsClicked < 0){
            this.mTex_audiancePoll.aUsed = .5;
            this.mTex_audiance_bg.visible = true;
            var val = 0;
            for (let i = 0; i < this.mTex_pFont.length; i++) {
                this.mTex_pFont[i].per = Math.floor(Math.random()*20);
                val += this.mTex_pFont[i].per;
                this.mTex_pFont[i].inc=0;
            }
            this.mTex_pFont[QUESTION[this.randQue[this.queNo]].correct].per += (100-val);
            this.counter = 0;
            // this.points -=5;
            this.userLife = .5;
        }
        if(clickval == 14){
            if(this.mTex_audiance_bg.visible == true){
                this.counter = 0;
                this.hidePoll();
            }
        }
    }
    onWindowResize() {
        mGame.camera.aspect = window.innerWidth / window.innerHeight;
        mGame.camera.updateProjectionMatrix();
        mGame.renderer.setSize(window.innerWidth, window.innerHeight);
        mGame.isResize = 5;
    }
    touchEvent(e, type, sys) {
        var scale = this.gameUI.height / this.gameUI.gameCanvas.getBoundingClientRect().height;
        var CANVAS_HEIGHT = window.innerHeight;
        var CANVAS_WIDTH = window.innerWidth;
        if (e.touches != null) {
            if (e.touches.length > 0) {
                this.mouse.x = (e.touches[0].pageX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(e.touches[0].pageY / window.innerHeight) * 2 + 1;
                this.coords.x = (e.touches[0].pageX - (window.innerWidth - this.gameUI.gameCanvas.getBoundingClientRect().width) / 2) * scale;
                this.coords.y = e.touches[0].pageY * scale;
                this.mouse.x = this.mouse.x *(CANVAS_HEIGHT/CANVAS_WIDTH);
            }
        } else {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.coords = { x: e.clientX, y: e.clientY };
            this.coords.x = (e.clientX - (window.innerWidth - this.gameUI.gameCanvas.getBoundingClientRect().width) / 2) * scale;
            this.coords.y = e.clientY * scale;

            var elem = this.renderer.domElement,
                boundingRect = elem.getBoundingClientRect(),
                x = (event.clientX - boundingRect.left) * (elem.width / boundingRect.width),
                y = (event.clientY - boundingRect.top) * (elem.height / boundingRect.height);
            this.mouse.x = (x / CANVAS_WIDTH) * 2 - 1;
            this.mouse.y = -(y / CANVAS_HEIGHT) * 2 + 1;
            this.mouse.x = this.mouse.x *(CANVAS_HEIGHT/CANVAS_WIDTH);
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (this.start === undefined) {
            return;
        }
        switch (GameScreen) {
            case GAMEPLAY:
                // if(this.mTex_audiance_bg.visible == true && this.counter > 80&&type==2){
                //     this.counter = 0;
                //     this.hidePoll();
                // }
                break;
            default:
                break;
        }

    }
    animate() {
        const game = this;
        setTimeout(function () {requestAnimationFrame(function () { game.animate(); });}, 1000 / 40);
        this.delta = this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
        this.gameUI.render(this.renderer);
        this.counter++;
        if (this.start === undefined) {
            this.meshLoading.rotation.set(this.counter*.1,this.counter*.1,this.counter*.1);
            return;
        }
        switch(GameScreen){
            case GAMEMENU:
                this.drawMenu();
                break;
            case GAMEPLAY:
                this.drawPlay();
                break;
            case GAMEOVER:
                this.drawOver();
                break;
        }

        if (this.isResize > 0) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.gameUI.resize();
            this.isResize--;
        }
    }
    setScreen(scr) {
        GameScreen = scr;
        this.mTex_fScore.forEach(element => { element.visible = false; });
        this.mTex_fonts.forEach(element => { element.visible = false; });
        this.mTex_fonts2.forEach(element => { element.visible = false; });
        this.mTex_pFont.forEach(element => { element.visible = false; });
        this.mTex_in50.forEach(element => { element.visible = false; });
        this.mTex_normal.forEach(element => { element.visible = false;element.a50 = 1;element.nApha = .01;});
        this.mTex_BG.visible = this.mTex_Sahi.visible = this.mTex_logo.visible = this.mTex_PlayNow.visible = false;
        this.mTex_5050.visible = this.mTex_audiancePoll.visible = this.mTex_correct.visible = this.mTex_incorrect.visible = this.mTex_points.visible = this.mTex_question.visible = false;
        this.meshLoading.visible = this.mTex_BGR.visible=this.mTex_close.visible = this.mTex_endscreen.visible=this.mTex_greatwork.visible=this.mTex_playagain.visible=this.mTex_learn.visible=false;
        this.mTex_audiancePoll.aUsed = 1;
        this.mTex_5050.aUsed = 1;
        this.AnsClicked = -1;
        this.AnsCounter =0;
        this.mTex_question.a = this.mTex_learn.a = this.mTex_endscreen.a = this.mTex_PlayNow.a=this.mTex_Sahi.a = .01;
        this.mTex_logo.s=0;
        this.zoom = 1000;
        this.counter = 0;
        switch (GameScreen) {
            case GAMEMENU:

                break;

        case GAMEPLAY:
            if(this.gltf_Amit!=null)
            this.gltf_Amit.visible = true;

            if(this.gltf_Bat!=null)
            this.gltf_Bat.visible = true;
            this.rad = 0;
            this.dis = 30;
            this.points = 0;
            set_rad();
            if(this.lvl %2==0){
                this.randQue.sort(compRan);
            }
            this.lvl ++;
            if(this.queNo > 6){
                this.queNo = 0;
            }else{
                if(this.queNo!=0)
                    this.queNo++;
            }
            this.correctAns = 0;
            console.log('this.queNo = '+this.queNo);
                break;
        }


    }
    drawOver(){
        DrawTexture(this.mTex_BG, 0, 0, 1230, 1920);
        DrawTexture(this.mTex_BGPlay, 0, 910, 1230, 100);
        DrawTexture(this.mTex_BGR, 0, -100, 1230, MAXH,.5);
        DrawTexture(this.mTex_Sahi, 0, -840, 634*1.4, 57*1.4,this.mTex_Sahi.a);
        DrawTexture(this.mTex_endscreen, 0, -230,836, 642,this.mTex_endscreen.a);
        DrawTexture(this.mTex_learn, 0, 420, 1172, 151,this.mTex_learn.a);
        DrawTexture(this.mTex_playagain, 0, 640, 1172, 98,this.mTex_PlayNow.a);

        // if(this.points > 20)
        if(this.correctAns>2)
        {
            DrawTexture(this.mTex_greatwork, 0, -350, 481, 252,this.mTex_endscreen.a);
            DrawLblAlfa(this.mTex_fonts[0], "You seem well-versed\nin Mutual Funds.", 0, -111, CLR_WHT, 72,this.mTex_endscreen.a);
        }else{
            DrawLblAlfa(this.mTex_fonts[0], "Brush up your\nknowledge of\nMutual Funds!", 0, -280, CLR_WHT, 80,this.mTex_endscreen.a);
        }
        if(this.mTex_Sahi.a<1){
            this.mTex_Sahi.a+=.05;
        }else if(this.mTex_endscreen.a < 1){
            this.mTex_endscreen.a+=.05;
        }else if(this.mTex_learn.a < 1){
            this.mTex_learn.a+=.05;
        }else if(this.mTex_PlayNow.a < 1){
            this.mTex_PlayNow.a+=.05;
        }
    }
    drawAnim(){
        // this.gltf_Amit.visible = this.isCorrect;
        // this.gltf_AmitSit.visible = !this.isCorrect;
        this.gltf_Amit.visible = true;
        if(this.isCorrect){
            if(this.gltf_Amit.used < 4){
                this.mixerAmit.update( this.delta );
                this.gltf_Amit.used += this.delta;
            }
        }else{
            if(this.gltf_Amit.used < 4){
                // this.mixerAmitSit.update( this.delta );
                this.gltf_Amit.used += this.delta*2;
            }
        }

    }
    drawMenu0(){
        if(this.gltf_Amit!=null)
        this.gltf_Amit.visible = true;
        // if(this.gltf_AmitSit!=null)
        // this.gltf_AmitSit.visible = true;
        if(this.gltf_Bat!=null)
        this.gltf_Bat.visible = true;

        // this.gltf_AmitSit.position.set(3.3,sy-4.0,sz);
        this.meshLoading.position.set(sx,sy,sz);
        this.meshLoading.visible = true;
    }
    drawMenu(){

        DrawTexture(this.mTex_BG, 0, 0, 1230, 1920);
        DrawTexture(this.mTex_BGPlay, 0, 910, 1230, 100);
        DrawTexture(this.mTex_Sahi, 0, -840, 634*1.4, 57*1.4,this.mTex_Sahi.a);
        DrawTexture(this.mTex_logo, 0, -100, 904*this.mTex_logo.s, 904*this.mTex_logo.s);
        DrawTexture(this.mTex_PlayNow, -30, 700, 1133, 149,this.mTex_PlayNow.a);
        if(this.mTex_Sahi.a<1){
            this.mTex_Sahi.a+=.05;
        }else if(this.mTex_logo.s < 1){
            this.mTex_logo.s+=.08;
        }else if(this.mTex_PlayNow.a < 1){
            this.mTex_PlayNow.a+=.04;
        }

    }
    drawPlay(){
        if(this.gltf_Amit!=null)
            this.gltf_Amit.visible = true;
            // if(this.gltf_AmitSit!=null)
            // this.gltf_AmitSit.visible = true;

        this.camera.position.x = Math.cos(this.rad)*this.dis;
        this.camera.position.z = Math.sin(this.rad)*this.dis;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        DrawTexture(this.mTex_BGPlay, 0, 910, 1230, 100);
        DrawTexture(this.mTex_logo, 0,-300, 904*this.mTex_logo.s, 904*this.mTex_logo.s);
        if(this.dis < 11){
            DrawTexture(this.mTex_Sahi, 0, -840, 634*1.4, 57*1.4,this.mTex_Sahi.a);
            if(this.mTex_Sahi.a<1){
                this.mTex_Sahi.a+=.05;
            }else if(this.mTex_logo.s < .41){
                this.mTex_logo.s+=.08;
            }else{
                this.mTex_PlayNow.a++;
                if(this.mTex_PlayNow.a<50)
                    DrawTexture(this.mTex_BGR, 0, -100, 1230, MAXH,this.mTex_PlayNow.a*.015);

                if(this.dis < 11){
                    this.mTex_PlayNow.a++
                }
            }
        }
        DrawTexture(this.mTex_audiancePoll, 370, -660, 190, 136,this.mTex_Sahi.a<1?this.mTex_Sahi.a:this.mTex_audiancePoll.aUsed);
        DrawTexture(this.mTex_5050, 370, -470, 190, 136,this.mTex_Sahi.a<1?this.mTex_Sahi.a:this.mTex_5050.aUsed);
        DrawTexture(this.mTex_points, -330, -660, 434, 77,this.mTex_Sahi.a);
        if(this.mp3Heart.pCnt < 100){
            this.mp3Heart.pCnt++;
            if(this.mp3Heart.pCnt == 100){
                this.mp3Heart.play();
            }
        }

        var fnt = 0;
        var str = "ABCD";
        if(this.mTex_Sahi.a > 0.9){
            // DrawLbl(this.mTex_fonts[fnt], this.points+" POINTS", -280, -645, CLR_ORG, 48);fnt++;
            if(this.zoom>40)
                DrawLbl(this.mTex_fScore[0], this.points+" POINTS", -280, -642, CLR_ORG, 48);
            else{
                for (let i = 0; i < this.mTex_fScore.length; i++) {
                    DrawLbl(this.mTex_fScore[i], this.points+" POINTS", -280, -640, CLR_ORG, 48+2*i);
                    if(this.zoom % 20 < 10)
                        this.mTex_fScore[i].visible = this.zoom % 20 == i;
                    else
                        this.mTex_fScore[i].visible = (20-this.zoom % 20) == i;
                }
                this.zoom++;
            }
        }
        if(this.mTex_PlayNow.a>10){
            DrawTexture(this.mTex_question, 0, 130, 1172, 151,this.mTex_question.a);
            DrawLblAlfa(this.mTex_fonts[fnt], ""+QUESTION[this.randQue[this.queNo]].que, 0, (""+QUESTION[this.randQue[this.queNo]].que).length>44 ?120:144, CLR_WHT, 48,this.mTex_question.a);fnt++;
            this.mTex_question.a+=.05;
        }
        for (let i = 0; i < this.mTex_normal.length; i++) {
            // DrawLbl(this.mTex_fonts[fnt++], str.charAt(i)+'.', -390, 300+i*140+16, CLR_ORG, 46,'left');
            if(this.mTex_PlayNow.a>20+i*10 && this.mTex_normal[i].a50==1){
                DrawLblAlfa(this.mTex_fonts[fnt++], str.charAt(i)+'. '+QUESTION[this.randQue[this.queNo]].ans[i], -390, 300+i*140+16, CLR_WHT, 46,this.mTex_normal[i].nApha,'left');
            }
            this.mTex_normal[i].visible = false;
            if(this.AnsClicked >= 0){
                if(QUESTION[this.randQue[this.queNo]].correct == i)
                    DrawTexture(this.mTex_correct, 0, 300+i*140, 1172, 98);
                else if(this.AnsClicked == i && this.AnsClicked != QUESTION[this.randQue[this.queNo]].correct)
                    DrawTexture(this.mTex_incorrect, 0, 300+i*140, 1172, 98);
                else{
                    // if(this.mTex_normal[i].a50 < 1)
                    //     DrawTexture(this.mTex_in50[i], 0, 300+i*140, 1172, 98);
                    // else
                        DrawTexture(this.mTex_normal[i], 0, 300+i*140, 1172, 98,1);
                }
            }else{
                // if(this.mTex_normal[i].a50 < 1)
                //     DrawTexture(this.mTex_in50[i], 0, 300+i*140, 1172, 98);
                // else
                if(this.mTex_PlayNow.a>20+i*10){
                    DrawTexture(this.mTex_normal[i], 0, 300+i*140, 1172, 98,this.mTex_normal[i].nApha < 1 ? this.mTex_normal[i].nApha:1);
                    this.mTex_normal[i].nApha+=.05;
                }
            }
        }
        if(this.AnsClicked >= 0){
            this.AnsCounter++;
            if(this.mTex_BGR.alpha > .01){
                this.mTex_BGR.alpha -=.01;
                if(this.mTex_BGR.alpha < .01){
                    this.mTex_BGR.alpha = .01;
                    this.mTex_BGR.visible = false;
                }
            }
            if(this.AnsCounter > 30){
                this.setVis();
                this.drawAnim();
            }
            if(this.gltf_Amit.used >= 4){
                this.gltf_Amit.used =0;
                this.mixerAmit.clipAction( this.animationsAmit[0]).reset();
                // this.mixerAmitSit.clipAction( this.animationsAmitSit[0]).reset();

                this.setNewQue();
            }
        }
        if(this.mTex_audiance_bg.visible){
            DrawTexture(this.rect, 0, -100, MAXH, MAXH,.8);
            DrawTexture(this.mTex_audiance_bg, 0, 0, 802, 922);
            DrawTexture(this.mTex_close, 360, -470, 112*.7,112*.7,1);
            for (let i = 0; i < this.mTex_power.length; i++) {
                var vl = this.mTex_pFont[i].inc*4;
                DrawTexture(this.mTex_power[i], -260+i*180, 290-vl*.5, 47, vl);
                DrawLbl(this.mTex_pFont[i], this.mTex_pFont[i].inc+"%", -260+i*180, -160, CLR_ORG, 48);
                if(this.mTex_pFont[i].inc < this.mTex_pFont[i].per){
                    this.mTex_pFont[i].inc++;
                }
            }
            if(this.counter > 1000){
                this.hidePoll();
            }
        }
        for (let i = fnt; i < this.mTex_fonts.length; i++) {
            this.mTex_fonts[i].visible = false;

        }
    }
    hidePoll(){
        this.mTex_close.visible = this.rect.visible = this.mTex_audiance_bg.visible = false;
        for (let i = 0; i < this.mTex_power.length; i++) {
            this.mTex_power[i].visible = this.mTex_pFont[i].visible = false;
        }
    }
    setVis(){
        this.mTex_in50.forEach(element => { element.visible = false; });
        this.mTex_normal.forEach(element => { element.visible = false;element.a50 = 1;element.nApha = .01;});
        this.mTex_fonts.forEach(element => { element.visible = false; });
        this.mTex_question.visible = this.mTex_incorrect.visible = this.mTex_correct.visible = false;

    }
    setNewQue(){
        console.log(this.queNo+" = levl = "+(((this.lvl-1)%2)*5+4));
        if(this.queNo >=((this.lvl-1)%2)*5+4){
            this.mp3Heart.pause();
            this.mp3Heart.pCnt =0;
            this.setScreen(GAMEOVER);
        }else{
            this.setVis();
            // this.gltf_Amit.visible = true;
            // this.gltf_AmitSit.visible = false;
            this.mTex_question.a = .01;

            this.queNo ++;
            this.AnsClicked = -1;
            this.AnsCounter =0;
            for (let i = 0; i < this.mTex_normal.length; i++) {
                this.mTex_normal[i].a50 = 1;
            }
            this.mTex_PlayNow.a =0;
        }
    }
}
class CannonHelper {
    constructor(scene) {
        this.scene = scene;
    }
    addLights(renderer) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const ambient = new THREE.AmbientLight(0xffffff, 1.5+1.5);
        this.scene.add(ambient);


        const lightL = new THREE.DirectionalLight(0xffffff,1.5+1.5);
        lightL.position.set(3, 0, 4);
        lightL.target.position.set(0, 0, 0);
        this.scene.add(lightL);
        const lightF = new THREE.DirectionalLight(0xffffff,2.3+1.5);//2.3
        // lightF.position.set(0, 2, 0);
        // lightF.target.position.set(3, 0, 0);

        lightF.position.set(-3, -1, 0);
        lightF.target.position.set(3, -1, 0);
        this.scene.add(lightF);

        const light = new THREE.DirectionalLight(0xffffff,1.5+1.5);
        light.position.set(3, 10, -4);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        const lightSize = 10;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 50;
        light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
        light.shadow.camera.right = light.shadow.camera.top = lightSize;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.sun = light;
        this.scene.add(light);


    }
}
