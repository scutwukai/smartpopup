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
            if(options.closeClass != undefined && opt.closeClass != options.closeClass){
                revokeClose(opt.closeClass); 
                setClose(options.closeClass);
            }
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
                    reposition($m, $popup);
                }
            });

            $popup.css({
                  "position"  : "absolute"
                , "zIndex": opt.zIndex + (pid * 2) + 1
            });
        };

        this.close = function(){
            $popup.hide();

            var $m = $(".s-modal"+pid);
            $m.animate({"opacity": 0}, {
                "step": function(){ opacity($m, this.opacity); },
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

            $m.css({
                  "height"  : $d.height()
                , "width"   : $d.width()
            })

            $popup.show().css({
                  "top"       : (wH-$popup.outerHeight(true))/2+$w.scrollTop()
                , "left"      : (wW-$popup.outerWidth(true))/2+$w.scrollLeft()
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

        // init
        setClose(opt.closeClass);

        $popup.attr("data-spopup", pid);
        pops[pid] = this;
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
          "closeClass"  : "s-close"
        , "modalColor"  : "#000"
        , "onClose"     : false
        , "onOpen"      : false
        , "opacity"     : 0.7
        , "zIndex"      : 9999
    };
})(jQuery);
