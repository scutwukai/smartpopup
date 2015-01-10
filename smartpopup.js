;(function($){
    "use strict";

    //global var
    var pops  = {}
       , $d   = $(document)
       , w    = window
       , $w   = $(w)
       , id   = 0
    ;

    var smartpopup = function($popup, options){
        var _this = this;

        // options
        var opt = $.extend({}, $.fn.sPopup.defaults, options);

        // variables
        var pid = cid()

        // property
        this.pid = pid;

        // api
        this.config = function(options){
            initEvent(options); 
            opt = $.extend(opt, options);
        }

        this.open = function(){
            if(opt.onOpen) opt.onOpen();

            var $m = $(".s-modal"+pid);
            if($m.length < 1){
                $m = $('<div class="s-modal'+pid+'"></div>');
                $m.appendTo("body");
            }

            opacity($m, 0);

            $m.css({
                "backgroundColor"  : opt.modalColor,
                "zIndex"           : opt.zIndex + (pid * 2)
            }).animate({"opacity": opt.opacity}, {
                "step": function(){ opacity($m); }
            });

            $popup.show().css({
                "zIndex": opt.zIndex + (pid * 2) + 1
            });

            reposition($m, $popup); 
        };

        this.close = function(){
            $popup.hide();

            var $m = $(".s-modal"+pid);
            $m.animate({"opacity": 0}, {
                "step": function(){ opacity($m); },
                "complete": function(){
                    $(".s-modal"+pid).hide();

                    if(opt.onClose) opt.onClose();
                }
            });
        };

        // private
        function reposition($m, $popup){
            var wH  = windowHeight()
              , wW  = windowWidth()
            ;

            $m.show().css({
                "position"  : 'absolute',
                "top"       : 0,
                "left"      : 0,
                "height"    : $d.height(),
                "width"     : $d.width()
            });

            $popup.show().css({
                "position"  : "absolute",
                "top"       : (wH-$popup.outerHeight(true))/2+$w.scrollTop(),
                "left"      : (wW-$popup.outerWidth(true))/2+$w.scrollLeft()
            });
        }

        function initEvent(eOpt){
            if(eOpt.closeClass){
                $popup.delegate("."+opt.closeClass, "click", function(e){
                    e.preventDefault();
                    _this.close();            
                });
            }
        }

        // init
        initEvent(opt);

        $popup.attr("data-spopup", pid);
        pops[pid] = this;
    };

    //////////////

    //$(window).scroll(function(){
    //    var $m = $(".s-modal"+pid);
    //    reposition($m, $popup);
    //});

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
            "filter"          : "alpha(opacity="+(opacity*100)+")",
            "-moz-opacity"    : opacity,
            "-khtml-opacity"  : opacity,
            "opacity"         : opacity
        });
    }

    /////////////

    $.fn.sPopup = function(act, options) {
        var $popup = $(this);
        if(options == undefined) options = {};

        var pid = $popup.attr("data-spopup");
        if (pid == undefined){
            pid = (new smartpopup($popup, options)).pid;
        }else{
            pops[pid].config(options);
        }

        pops[pid][act]();
        return $popup;
    };

    ////////////
    $.fn.sPopup.defaults = {
          closeClass:       "s-close"
        , modalColor:       "#000"
        , onClose:          false
        , onOpen:           false
        , opacity:          0.7
        , zIndex:           9997 // popup gets z-index 9999, modal overlay 9998
    };
})(jQuery);
