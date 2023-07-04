/**
 * jQuery Permissionize Plugin v0.0.1
 *
 * Copyright (c) 2023 Permissionize DEV
 * Licensed under the  The GNU General Public License v3.0 (See terms below)
 *
 * @author Permissionize DEV
 *
 * @projectDescription    jQuery plugin to send permissible data to permissionize
 * 
 * @version 0.0.1
 * 
 * @requires jquery.js (v 1.2.x minimum)
 *
 *
 * TERMS OF USE - jQuery Permissionize Plugin
 * Open source under The GNU General Public License v3.0
 *
 *
 */
var cnfg = {
    campaignId:'649ada5087d58ed35682247d',
    url:'http://perm.gain250.com/token/api/stepwise/',
    permissionize_token:'',
    universal_leadid:'',
    location_url_ui:'',
    ip_address_ui:'',
    screen: {
        height: 0,
        width: 0,
        orientation: "portrait"
    },
};
const isVisible = function(elem) {
    if (!(elem instanceof Element)) return false;
        const style = getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity < 0.1) return false;
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
            elem.getBoundingClientRect().width === 0) {
            return false;
        }
        const elemCenter   = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
        if (elemCenter.y < 0) return false;
        if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
        let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        do {
            if (pointContainer === elem) return true;
        } while (pointContainer = pointContainer.parentNode);
    return false;
}
window.onload = function() {
    if (window.jQuery) {  
        loadPermissionize();
    } else {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js";
        s.onload = function() {
            loadPermissionize();
        }
        document.head.appendChild(s);
    }
}
function loadPermissionize(){
(function ($) {

    $.permissionize = {
        init: function () {
            let is_t_find = $('input:hidden[name=permissionize_token]').val();
            let uni_l_id = $('input:hidden[name=universal_leadid]').val();
            if(is_t_find!= undefined){
                this.getIp();
                cnfg.permissionize_token = this.genuuidv4();
                cnfg.location_url_ui = window.location.href;
                cnfg.screen.height = window.screen.availHeight;
                cnfg.screen.width = window.screen.availWidth;
                cnfg.screen.orientation = window.screen.orientation.type;
                cnfg.universal_leadid = uni_l_id;
            }
        },
        genuuidv4 : function () {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
              (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
          },
        getIp:function(){
            $.getJSON('https://ipapi.co/json/', function(data) {
                cnfg.ip_address_ui = data.ip;
            });
        },
        send: function(cnfg){
            let parr=[];
            $("[permissible]").each(function(i,el){
                if(isVisible(el)){
                let tname= $(el).prop("tagName");
                let name = $(el).prop("name");
                let inputArr = ["input","select","textarea"];
                let tval;
                if(inputArr.includes(tname.toLowerCase())){
                    tval = $(el).val();
                }else{
                    tval = $(el).text();
                }
                parr.push({
                    tag: tname,
                    value:tval,
                    name:name 
                });
            }
            });
            const body = {    
                "session_id": cnfg.permissionize_token,
                "location_url_ui": cnfg.location_url_ui,
                "ip_address_ui": cnfg.ip_address_ui,
                "screen": {
                    "height": cnfg.screen.height,
                    "width": cnfg.screen.width,
                    "orientation": cnfg.screen.orientation
                },
                "universal_leadid": cnfg.universal_leadid,
                "disclaimer": parr
            };
            const headers = {
                type: 'application/json',
            };
            const blob = new Blob([JSON.stringify(body)], headers);
            navigator.sendBeacon(cnfg.url+cnfg.campaignId, blob);
        }
    };
})(jQuery);
jQuery(document).ready(function ($) {

    $.permissionize.init();

    $('[permissionize]').bind('click tap', function () {
        $.permissionize.send(cnfg);
    })
    $(document).one('submit','form',function(e){
        e.preventDefault();
        $.permissionize.send(cnfg);
        $(this).submit();
     });
});
}
