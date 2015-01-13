;(function($){
    "use strict";

    // const
    var GOLD = 0.618;
    var STATUS = {
          "INIT": 0
        , "OPENED": 1
        , "CLOSED": 2
    };

    //global var
    var $d        = $(document)
       , w         = window
       , $w        = $(w)
       , id        = 0
    ;

    var SmartPopup = function($popup, options){
        var _this = this;

        // options
        var opt = $.extend({}, $.fn.sPopup.defaults, options);

        // variables
        var pid = cid()
          , st = STATUS.INIT
          // big pop in both dimension
          , bp = {"h": false, "w": false}
        ;

        // property
        this.pid = pid;

        // api
        this.config = function(options){
            if(options.closeClass !== undefined && opt.closeClass != options.closeClass){
                revokeClose(opt.closeClass); 
                setClose(options.closeClass);
            }
            opt = $.extend(opt, options);
        };

        this.open = function(){
            var $m = $(".s-modal"+pid);
            if($m.length < 1){
                $m = $('<div class="s-modal'+pid+'"></div>');
                $m.appendTo("body");
            }

            opacity($m, 0);

            $m.show().css({
                  "position"         : 'absolute'
                , "top"              : 0
                , "left"             : 0
                , "height"           : $d.height()
                , "width"            : $d.width()
                , "backgroundColor"  : opt.modalColor
                , "zIndex"           : opt.zIndex + (pid * 2)
            }).animate({"opacity": opt.opacity}, {
                "step": function(){ opacity($m, this.opacity); },
                "complete": function(){
                    reposition();
                    setScroll();
                    setResize();

                    if(opt.onOpen) opt.onOpen();
                }
            });

            $popup.css({
                  "position"  : "absolute"
                , "zIndex": opt.zIndex + (pid * 2) + 1
            });
        };

        this.close = function(){
            revokeScroll();
            revokeResize();

            if(opt.closeRemove) $popup.remove();
            else $popup.hide();

            var $m = $(".s-modal"+pid);
            $m.animate({"opacity": 0}, {
                "step": function(){ opacity($m, this.opacity); },
                "complete": function(){
                    $m.remove();
                    if(opt.onClose) opt.onClose();
                }
            });
        };

        this.reposition = function(){
            reposition();
        };

        this.animateRepos = function(){
            animateRepos();
        };

        // private
        function calcPosition(){
            var wH  = windowHeight()
              , wW  = windowWidth()
              , oT  = (wH-$popup.outerHeight(true))/2  // offset Top
              , oL  = (wW-$popup.outerWidth(true))/2   // offset Left
            ;

            bp.h = (oT < 0);
            bp.w = (oL < 0);

            if(bp.h){ oT = wH/2 * (1 - GOLD); }
            if(bp.w){ oL = wW/2 * (1 - GOLD); }

            return {
                  "top"  : Math.round(oT) + $w.scrollTop()
                , "left" : Math.round(oL) + $w.scrollLeft()
            };
        }

        function reposition(pos){
            if(pos === undefined) pos = calcPosition(); 

            $popup.show().css({
                  "top"   : pos.top
                , "left"  : pos.left 
            });
        }

        function animateRepos(pos){
            if(pos === undefined) pos = calcPosition(); 

            $popup.show().stop().animate({
                  "top"   : pos.top
                , "left"  : pos.left 
            });
        }

        function close(e){
            e.preventDefault();
            _this.close();            
        }

        function setClose(classname){
            if(!classname) return;
            $popup.delegate("."+classname, "click", close);
        }

        function revokeClose(classname){
            if(!classname) return;
            $popup.undelegate("."+classname, "click", close);
        }

        function scroll(e){
            var pos = calcPosition();

            if(bp.h) delete pos.top;
            if(bp.w) delete pos.left;

            if(size(pos) < 1) return;
            animateRepos(pos);
        }

        function setScroll(){
            $(window).bind("scroll", scroll);
        }

        function revokeScroll(){
            $(window).unbind("scroll", scroll);
        }

        function resize(e){
            var pos = calcPosition();

            if(bp.h) delete pos.top;
            if(bp.w) delete pos.left;

            if(size(pos) < 1) return;
            animateRepos(pos);
        }

        function setResize(){
            $(window).bind("resize", resize);
        }

        function revokeResize(){
            $(window).unbind("resize", resize);
        }

        // init
        setClose(opt.closeClass);
        $popup.attr("data-spopup", pid);
    };

    //////////////

    function cid(){
        return id++;
    }

    function windowHeight(){
        return w.innerHeight || $w.height();
    }
    
    function windowWidth(){
        return w.innerWidth || $w.width();
    }

    function opacity($m, opacity){
        $m.css({
              "filter"          : "alpha(opacity="+(opacity*100)+")"
            , "-moz-opacity"    : opacity
            , "-khtml-opacity"  : opacity
            , "opacity"         : opacity
        });
    }

    function size(obj){
        var c = 0;
        for(var k in obj){
            if(obj.hasOwnProperty(k)) c++;
        }

        return c;
    }

    /////////////

    $.fn.sPopup = function(act, options) {
        var $popup = $(this);
        if(options === undefined) options = {};

        var spopup = $popup.data("spopup");
        if(spopup === undefined){
            spopup = new SmartPopup($popup, options);
            $popup.data("spopup", spopup);
        }else{
            spopup.config(options);
        }

        spopup[act]();
        return $popup;
    };

    ////////////
    $.fn.sPopup.defaults = {
          "closeClass"  : "s-close"
        , "closeRemove" : false
        , "modalColor"  : "#000"
        , "onClose"     : false
        , "onOpen"      : false
        , "opacity"     : 0.7
        , "zIndex"      : 9999
    };
})(jQuery);
