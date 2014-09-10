/**
 * Created with JetBrains WebStorm.
 * User: Haywood Jablome
 * Date: 27.08.14
 * Time: 09:52
 * To change this template use File | Settings | File Templates.
 */
 
this.LEDStrip = this.LEDStrip || {};
(function () {
    var Code = function () {
        this.initialize();
    };

    var p = Code.prototype;

    // Place variables here p.variable
    p.host                  = "LEDStrip";
    p.canvas                = document.getElementById("mycanvas");
    p.pille_normal_img      = "./images/pille.png";
    p.pille_active_img      = "./images/pille_active.png";
    p.pille_out_img         = "./images/pille_out.png";
    p.spin_button_img       = "./images/spin.png";
    p.the_speed             = 20;
    p.power                 = 0;
    p.spinTimer             = 0;
    p.spin_btn              = null;

    p._stage                = new createjs.Stage(p.canvas);
    p.active_pills          = [];
    p.out_pilles            = [];
    p.pille_active          = null;
    p.pille_out             = null;
    p.imageObj              = null;
    p.images                = null;
    p.mytween               = createjs.Tween;
    p.motion_path           = [0,100,200,300,400,500,600];
    p.audioPath             = "./sounds/";
    p.manifest              = [
                                {id:"wheel",src:"wheel.wav"},
                                {id:"Music",src:"ingame-music.ogg"},
                                {id:"wheel_short",src:"wheel_short.mp3"},
                                {id:"wheel_cut",src:"wheel_cut.mp3"}
                              ];
    createjs.Sound.alternateExtensions = ["mp3"];


    //METHODS

    //TICKER METHOD
    p.handleTick = function(e)
    {
        p._stage.update();
    }
    createjs.Ticker.addEventListener("tick",p.handleTick.bind(this));

    p.handleFileLoad = function(e)
    {
        console.log("file load ...");
        var item = e.item;
        var type = e.type;
        if(type == createjs.LoadQueue.IMAGE)
        {
           this.spin_btn = new createjs.Bitmap(e.item.type);
           this._stage.addChild(this.spin_btn);
        }
    }
    p.preloader = function()
    {
        var queue = new createjs.LoadQueue(false);
        queue.loadFile({src:this.spin_button_img},{type:createjs.LoadQueue.IMAGE});
        queue.setUseXHR(false);
        queue.on("fileload", this.handleFileLoad,this);
    }


    p.preloading_images = function()
    {
        var i                   = 0;
        this.imageObj           = new Image();
        console.log(this.imageObj);
        this.images             = new Array();

        //start preloading ...
         try{
             for(i = 0; i<1;i++)
             {
                 this.imageObj.source    = this.pille_active_img;
                 //this.imageObj.source    = this.spin_button_img;
                 this.images.push(this.imageObj);
                 console.log(this.imageObj);
             }

         }catch (e){

             console.log("Failed to load the image " + this.imageObj + ":: source " + this.imageObj.src);
         }
        //draw images ...
          this.initialDraw();
    }

    p.preload_sounds = function()
    {
        if(!createjs.Sound.initializeDefaultPlugins())
        {
            return;
        }


    }

    p.create_draw_area= function()
    {
        var canvas      = document.getElementById("mycanvas");
        var ctx         = canvas.getContext("2d");
        ctx.fillStyle   = "#FF0000";
//        ctx.fillRect(0,0,600,400);

        if(canvas.getContext)
        {
          this.preloading_images();

        }

    }

    p.initialDraw = function(_canvas)
    {
        try{
            for(var i = 0; i < 6; i++)
            {
                var pille_ac    = new createjs.Bitmap(this.pille_active_img);
                var pille_out   = new createjs.Bitmap(this.pille_out_img);
                this.active_pills.push(pille_ac);
                this.out_pilles.push(pille_out);
                pille_out.x     = i*100;
                pille_out.name  = "pille_out"+i;
                pille_ac.x      = i* 100;
                pille_ac.name   = "pille" + i;
//                console.log("My image " + pille_ac);
//                console.log(pille_ac.name);
//                console.log(pille_ac);
                this._stage.addChild(pille_ac);
                this._stage.addChild(pille_out);
            }
        }catch (e){
            console.log(e);

        }

    }

    //INIT LIGHTS

    p.initLights = function()
    {
        var stop_at_light = undefined;
    }

    //START LIGHTS

    p.startLights = function(startLights,out_pilles,iterator,speed,counter,bulb)
    {
          //var myimage   = out_pilles[iterator];

          if(iterator < out_pilles.length-1)
          {
              iterator++;
//              speed +=20;
              counter++;
          }
           if(iterator%2)
           {
               speed+=15;
               console.log("speed++");
           }


          if(iterator == out_pilles.length-1)
          {
              iterator = 0;
              out_pilles.reverse();
          }
        console.log("Counter --> " + counter);
        if(counter >= 40 )
        {
            var my_bb = Math.round((Math.random() * (out_pilles.length - 1)));
            if(bulb < iterator)
            {
                console.log("!!! BULB kleiner als ITERATOR");
                var last_lights = (out_pilles.length - iterator) +(out_pilles.length - bulb);
                var i           = 1;
                (function myloop (i){

                    setTimeout(function(){
                        createjs.Tween.get(out_pilles[iterator])
                            .to({alpha:0},0)
                            .wait(30)
                            .to({alpha:1},210);
                        createjs.Sound.play("wheel_cut");
                        if(--i) myloop(i);
                        else
                        {
                            createjs.Tween.get(out_pilles[my_bb]).wait(30).to({alpha:0},speed);
                            console.log(out_pilles[bulb].alpha);
                            createjs.Sound.play("wheel_cut");
                        }
                    },speed)

                })(bulb);
            }
            else
            {
                console.log("!!! BULB groesser als ITERATOR");

                last_lights = (out_pilles.length - bulb);
                console.log("Das ist last_lights --> " + "Arr.length: " +out_pilles.length + "-" + " Iterator: " + iterator + " = " + last_lights);
                (function myloop (i){

                    setTimeout(function(){
                        createjs.Tween.get(out_pilles[iterator])
                            .to({alpha:0},0)
                            .wait(30)
                            .to({alpha:1},speed);
                        createjs.Sound.play("wheel_cut");
                        iterator++;
                        if(--i) myloop(i);
                        else
                        {
                            createjs.Tween.get(out_pilles[my_bb]).wait(30).to({alpha:0},speed);
                            createjs.Sound.play("wheel_cut");
                            console.log(out_pilles[bulb].alpha);
                        }
                    },speed)

                })(i);
            }
            return ;
        }
            createjs.Tween.get(out_pilles[iterator+1])
                //.wait(speed[4])
                .to({alpha:0},20)
                .wait(30)
                .to({alpha:1},speed)
                //.call(startLights,[startLights,out_pilles,iterator,speed]);

            createjs.Tween.get(out_pilles[iterator+1])
                .wait(20)
                .to({alpha:0},0)
                .to({alpha:1},speed-20)
                .call(startLights,[startLights,out_pilles,iterator,speed,counter,bulb]);
    }

    p.count = function(evt)
    {
        var mytime = Math.ceil(evt.time/1000);
        console.log("Tick!" + mytime);

        if(mytime == 2)
        {
            console.log("Mytime ist --> " + mytime);
            //this.mytween.setPaused(true);


        }
        return mytime;
    }


    p.initialize = function ()
    {
        //PRELOAD SOUND
        createjs.Sound.addEventListener("loadComplete", this.handleLoad);
        createjs.Sound.registerManifest(this.manifest,this.audioPath);
        createjs.Sound.play("wheel");
        this.preloader();
        this.create_draw_area();
        var iterator = 0;
        var speed    = 0
        var counter  = 0;
        //var myticker = createjs.Ticker.addEventListener("tick",this.count);
        var bulb = Math.round((Math.random() * (this.out_pilles.length - 1)));
        console.log("bulb --> " + bulb);
        var my_bulb = this.startLights(this.startLights,this.out_pilles,iterator,speed,counter,bulb);
        console.log("my bulb --> " + my_bulb);
    };





    LEDStrip.Code = Code;
}());
