var TipsLayer=cc.Layer.extend({
    current:0,
    isTween:false,
    startButton:null,
    ctor:function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.xk_plist);
        cc.spriteFrameCache.addSpriteFrames(res.product_plist);

        this.origin = cc.director.getVisibleOrigin();
        this.size = cc.director.getVisibleSize();
        this.init();
    },

    init:function() {
        var self = this;
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {

                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                self.touchStart = locationInNode;
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                return true;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                self.touchEnd = locationInNode;

                if ((self.touchStart.x - self.touchEnd.x) > 10) {
                    //console.log('从右往左');
                    var event = new cc.EventCustom(TipsLayer.SWIPE_TO_LEFT);
                    cc.eventManager.dispatchEvent(event);

                } else if ((self.touchStart.x - self.touchEnd.x) < -10) {
                    //console.log('从左往右')
                    var event = new cc.EventCustom(TipsLayer.SWIPE_TO_RIGHT);
                    cc.eventManager.dispatchEvent(event);
                }
            }
        });

        this._listenerToLeft = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:TipsLayer.SWIPE_TO_LEFT,
            callback: function(event){
                self.swipeToLeft();
            }
        });

        this._listenerToRight= cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:TipsLayer.SWIPE_TO_RIGHT,
            callback: function(event){
                self.swipeToRight();
            }
        });
        cc.eventManager.addListener(this._listenerToRight, 1);
        cc.eventManager.addListener(this._listenerToLeft, 1);
        cc.eventManager.addListener(listener1, this);
        this.initPage();
    },
    swipeToLeft:function(){

        if(this.isTween||this.current==1){return;}

        this.current++;
        this.checkUi(this.current)
        this.isTween=true;
        var self=this;

        var action=new cc.MoveTo(0.3,cc.p(-this.size.width*this.current,0));
        var callBack=new cc.CallFunc(function(){
            self.isTween=false;

        })
        var seq=new cc.sequence(action,callBack);
        var pp=this.getChildByName("pp")
        pp.runAction(seq);


    },

    swipeToRight:function(){

        if(this.isTween||this.current==0){return;}

        this.current--;
        var self=this;
        this.checkUi(this.current)
        var action=new cc.MoveTo(0.3,cc.p(-this.size.width*this.current,0));
        var callBack=new cc.CallFunc(function(){
            self.isTween=false;
        })
        var seq=new cc.sequence(action,callBack);
        var pp=this.getChildByName("pp")
        pp.runAction(seq);


    },

    initPage:function() {
        var self = this;
        var pp = cc.Sprite.create()
        pp.setAnchorPoint(0, 0);
        pp.width = this.size.width *2 ;
        this.addChild(pp, 1, "pp");

        var pageF0=cc.Sprite.create(res.introduce1);
        pageF0.setAnchorPoint(0,0);
        pp.addChild(pageF0);


        var pageF=cc.Sprite.create(res.introduce2);
        pageF.setAnchorPoint(0,0);
        pp.addChild(pageF);
        pageF.x=this.size.width

        var startButton = cc.MenuItemImage.create(res.startButton,res.startButton,function(e){
            self.goGame();
        })
        startButton.setAnchorPoint(0,0);

        this.skip_btn= new cc.Menu(startButton);
        this.addChild(this.skip_btn,4)

        this.skip_btn.setPosition(this.origin.x+(this.size.width-startButton.width)/2,this.origin.y+startButton.height/4);
        this.skip_btn.visible=false;
        this.skip_btn.active=false;
    },
    checkUi:function(id){

        if(id==0)
        {
            this.skip_btn.visible=false
            this.skip_btn.active=false;

        }else{

            this.skip_btn.visible=true
            this.skip_btn.active=true;

        }

    },
    goGame:function(){
        cc.LoaderScene.preload(game_source, function () {//加载游戏场景
            var scene = new GameScene();
            cc.director.runScene(new cc.TransitionFade(CF.sceneTime, scene));
        }, this);

    }

})


 var TipsScene=cc.Scene.extend({
    onEnter:function () {
        this._super();
        var tips=new TipsLayer();
        this.addChild(tips);
    }
})

TipsLayer.SWIPE_TO_LEFT="SWIPE_TO_LEFT"
TipsLayer.SWIPE_TO_RIGHT="SWIPE_TO_RIGHT"
