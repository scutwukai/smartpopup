;(function($){
    "use strict";

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
        var pid = cid();

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

            opt.closeRemove ? $popup.remove() : $popup.hide();

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
            ;

            return {
                  "top"  : (wH-$popup.outerHeight(true))/2+$w.scrollTop()
                , "left" : (wW-$popup.outerWidth(true))/2+$w.scrollLeft()
            };
        }

        function reposition(){
            var pos = calcPosition(); 

            $popup.show().css({
                  "top"   : pos.top
                , "left"  : pos.left 
            });
        }

        function animateRepos(){
            var pos = calcPosition(); 

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
            animateRepos();
        }

        function setScroll(){
            $(window).bind("scroll", scroll);
        }

        function revokeScroll(){
            $(window).unbind("scroll", scroll);
        }

        function resize(e){
            animateRepos();
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
            spopup = new SmartPopup($popup, options)
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
