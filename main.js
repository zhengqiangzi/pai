cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(640,1136, cc.ResolutionPolicy.FIXED_HEIGHT);
	cc.view.resizeWithBrowserSize(true);
    //load resources

    cc.LoaderScene.preload(index_resources, function () {
        cc.director.runScene(new TipsScene());
    }, this);
};
cc.game.run();