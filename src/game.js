var GameProductLayer=cc.Layer.extend({//游戏产品层

    mainSprite:null,
    failSprite:null,
    ctor:function () {

        this._super();
        this.init();
    },
    init:function(){

        var animFrames = [];
        for (var i =1; i <=4; i++) {
            var str = "product" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        cc.animationCache.addAnimation(animation, "product");



        this.mainSprite=cc.Sprite.create("#product1.png");
        this.mainSprite.setAnchorPoint(0,0);
        this.addChild(this.mainSprite)

        this.animation = cc.animationCache.getAnimation("product");
        this.mainSprite.runAction(new cc.Animate(this.animation).repeatForever());
    }


})

var ObstacleLayer=cc.Layer.extend({//障碍物层
    mainSprite:null,
    ctor:function () {
        this._super();
        this.origin = cc.director.getVisibleOrigin();
        this.size = cc.director.getVisibleSize();
        this.init();
    },
    init:function(){
        this.mainSprite=cc.Sprite.create(res.obstacl1);
        this.mainSprite.setAnchorPoint(0,0);
        this.addChild(this.mainSprite)
        this.mainSprite.setPosition(this.origin.x-this.size.width,(this.size.height-this.mainSprite.height)/2);
        //this.mainSprite.setPosition(this.origin.x+(this.size.width-this.mainSprite.width)/2,(this.size.height-this.mainSprite.height)/2);
    },
    playAnimation:function(){

       var left_in=cc.moveTo(1,cc.p(this.origin.x+(this.size.width-this.mainSprite.width)/2,(this.size.height-this.mainSprite.height)/2))
        var left_out=cc.moveTo(1.5,cc.p(this.origin.x+this.size.width,(this.size.height-this.mainSprite.height)/2));
       var right_out=cc.moveTo(1,cc.p(-this.size.width,(this.size.height-this.mainSprite.height)/2));
        var delay_middle=cc.delayTime(3);

        var seq = cc.sequence(left_in,cc.delayTime(3), left_out,left_in.clone(),cc.delayTime(3),right_out);
        var seq2 = seq.clone();
        this.mainSprite.runAction(seq.repeatForever());

    },
    isOut: function () {
       return this.mainSprite.x<-this.mainSprite.width/2||this.mainSprite.x>this.mainSprite.width/2
    }
})

var CameraLayer=cc.Layer.extend({//相机层
    mainSprite:null,
    ctor:function () {
        this._super();

        this.origin = cc.director.getVisibleOrigin();
        this.size = cc.director.getVisibleSize();
        this.init();
    },
    init:function(){


            var animFrames = [];
            for (var i =0; i <=3; i++) {
                var str = "camera1-1-" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                animFrames.push(frame);
            }
            var animation = new cc.Animation(animFrames, 0.1);
            cc.animationCache.addAnimation(animation, "xk");



        this.mainSprite=cc.Sprite.create("#camera1-1-0.png");
        this.mainSprite.setAnchorPoint(0,0);
        this.addChild(this.mainSprite)
        this.mainSprite.setPosition(this.origin.x+(this.size.width-this.mainSprite.width)/2,this.origin.y+(this.size.height-this.mainSprite.height)/2);
        this.createCameraButton();


        this.animation = cc.animationCache.getAnimation("xk");
        this.mainSprite.runAction(new cc.Animate(this.animation).repeatForever());
    },
    createCameraButton:function(){
        var btn_desc=cc.Sprite.create(res.camera2);
            btn_desc.setAnchorPoint(0,0);
            this.addChild(btn_desc);

            btn_desc.setPosition((this.origin.x+this.size.width-btn_desc.width)/2,this.origin.y+this.mainSprite.y-btn_desc.height*1.5);

        var self=this;
        var startButton = cc.MenuItemImage.create(res.camera3,res.camera3,function(e){
            var event = new cc.EventCustom("pevent");
            cc.eventManager.dispatchEvent(event);


        })
        startButton.setAnchorPoint(0,0);

        var paozhaoBtn= new cc.Menu(startButton);
        paozhaoBtn.setAnchorPoint(0,0)
        this.addChild(paozhaoBtn)
        paozhaoBtn.setPosition(this.origin.x+(this.size.width-startButton.width)/2,btn_desc.y-startButton.height)

    }
})



var MainLayer=cc.Layer.extend({
    sg:null,
    fail:null,
    ctor:function(){
        this._super();
        this.origin = cc.director.getVisibleOrigin();
        this.size = cc.director.getVisibleSize();
        this.init();
    },
    init:function(){

       var self=this;

        var _listener1 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:"pevent",
            callback: function(event){
                self.shanguangdeng()
            }
        });

        var _listener2 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:"playagainevent",
            callback: function(event){

               self.fail.visible=self.fail.active=false;
                self.obstacle.visible= self.obstacle.active= self.layer_camera.visible= self.layer_camera.active= self.product.visible= self.product.active=true;
            }
        });
        cc.eventManager.addListener(_listener1,this);
        cc.eventManager.addListener(_listener2,this);


        this.product=new GameProductLayer();
        this.addChild(this.product)

        this.obstacle=new ObstacleLayer();
        this.addChild(this.obstacle)

        this.layer_camera=new CameraLayer();
        this.addChild(this.layer_camera)
       this.obstacle.playAnimation();

    },
    shanguangdeng:function(){
       if(this.sg==null) {
           this.sg = cc.Sprite.create(res.sg);
           this.sg.setAnchorPoint(0, 0);
           this.addChild(this.sg)
       }else{

           this.sg.visible=true;
           this.sg.active=true;
       }
        var action2 = cc.blink(0.1,2);
        var end_call=cc.callFunc(this.fun,this)
        var seq = cc.sequence(action2,end_call);
        this.sg.runAction(seq);

    },
    fun:function(){
       this.sg.visible=false;
        this.sg.active=false;

        if(this.obstacle.isOut()){
            //拍照成功
        }else{
            this.setFail();
            this.obstacle.visible=this.obstacle.active=this.layer_camera.visible=this.layer_camera.active=this.product.visible=this.product.active=false;
            //拍照失败
        }
    },
    setFail:function(){

        if(this.fail==null)
        {
            this.fail=new FailLayer();
            this.addChild(this.fail);
        }else{

            this.fail.visible=this.fail.active=true;

        }

    }

})

var FailLayer=cc.Layer.extend({
    failSprite:null,
    againButton:null,

    ctor:function(){
        this._super();
        this.origin = cc.director.getVisibleOrigin();
        this.size = cc.director.getVisibleSize();
        this.init();
    },
    init:function(){
        this.failSprite=cc.Sprite.create(res.fail1);
        this.failSprite.setAnchorPoint(0,0);
        this.addChild(this.failSprite)

    var self=this;
        var fail = cc.MenuItemImage.create(res.again,res.again,function(e){
            var event = new cc.EventCustom("playagainevent");
            cc.eventManager.dispatchEvent(event);
        })
        fail.setAnchorPoint(0,0);

        this.againButton= new cc.Menu(fail);
        this.addChild(this.againButton,4)

        this.againButton.setPosition(this.origin.x+(this.size.width-fail.width)/2,this.origin.y+fail.height/4);
    }


})

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var mainLayer=new MainLayer();
        this.addChild(mainLayer)
    /*    var productLayer = new GameProductLayer();
        this.addChild(productLayer);

        var layer_obstacle=new ObstacleLayer()
        this.addChild(layer_obstacle)

         var layer_camera=new CameraLayer();
        this.addChild(layer_camera)*/

    }

})