webpackJsonp([1],{0:function(e,t,i){i("j1ja"),e.exports=i("NHnr")},"4Y9l":function(e,t){},"7/cP":function(e,t){},NHnr:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("7+uW"),r=(i("O6K2"),{props:{bufferScale:{type:Number,default:0},durationScale:{type:Number,default:0},durationLeft:{type:Number,default:0},movingTime:{type:String,default:""}},data:function(){return{isDragging:!1,movingLeft:0,movingFlag:!1}},methods:{getMovingTime:function(e){var t=e.clientX-this.$refs.track.getBoundingClientRect().left,i=this.$refs.track.getBoundingClientRect().width;t<=i&&t>=0&&(this.$emit("getMovingTime",t/i),this.movingLeft=(t-30)/i,this.movingFlag=!0)},hideMovingTime:function(){this.movingFlag=!1},bindEvents:function(){this.isDragging=!0,window.addEventListener("mousemove",this.controlsDragging,!1),window.addEventListener("mouseup",this.cancelDragging,!1)},controlsDragging:function(e){this.isDragging&&this.dumpTrack(e)},cancelDragging:function(e){this.isDragging=!1,window.removeEventListener("mousemove",this.controlsDragging,!1),window.removeEventListener("mouseup",this.cancelDragging,!1),this.$emit("cancelDragging")},dumpTrack:function(e){var t=e.clientX-this.$refs.track.getBoundingClientRect().left,i=this.$refs.track.getBoundingClientRect().width;t<=i&&t>=0&&this.$emit("dumpDurationTrack",t/i,e.type)},wheelTrack:function(e){120===e.wheelDelta&&this.$emit("wheelDurationTrack",!0),-120===e.wheelDelta&&this.$emit("wheelDurationTrack",!1)}},beforeDestroy:function(){window.removeEventListener("mousemove",this.controlsDragging,!1),window.removeEventListener("mouseup",this.cancelDragging,!1)}}),o={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{ref:"track",staticClass:"progress-track",on:{mousedown:function(t){t.preventDefault(),e.dumpTrack(t)},mousewheel:function(t){t.preventDefault(),e.wheelTrack(t)},mousemove:function(t){t.preventDefault(),e.getMovingTime(t)},mouseover:function(t){t.preventDefault(),e.getMovingTime(t)},mouseout:function(t){t.preventDefault(),e.hideMovingTime(t)}}},[i("div",{staticClass:"buffered-progress-percent",style:{width:100*e.bufferScale+"%"}}),e._v(" "),i("div",{ref:"percent",staticClass:"progress-percent",style:{width:100*e.durationScale+"%"}}),e._v(" "),i("div",{ref:"control",staticClass:"progress-control",style:{left:100*(e.durationScale-e.durationLeft)+"%"},on:{mousedown:function(t){t.stopPropagation(),t.preventDefault(),e.bindEvents(t)}}}),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.movingFlag,expression:"movingFlag"}],staticClass:"movingTime",style:{left:100*e.movingLeft+"%"}},[i("b",[e._v(e._s(e.movingTime))])])])},staticRenderFns:[]};var s=i("VU/8")(r,o,!1,function(e){i("4Y9l")},"data-v-7833d9c9",null).exports,a={props:{volume:{type:Number,default:0}},data:function(){return{isDragging:!1}},methods:{bindEvents:function(){this.isDragging=!0,window.addEventListener("mousemove",this.controlsDragging,!1),window.addEventListener("mouseup",this.cancelDragging,!1)},controlsDragging:function(e){this.isDragging&&this.dumpTrack(e)},cancelDragging:function(){this.isDragging=!1,window.removeEventListener("mousemove",this.controlsDragging,!1),window.removeEventListener("mouseup",this.cancelDragging,!1)},dumpTrack:function(e){var t=e.clientX-this.$refs.track.getBoundingClientRect().left,i=this.$refs.track.getBoundingClientRect().width;t<=i&&t>=0&&this.$emit("dumpVolumeTrack",t/i)},wheelTrack:function(e){120===e.wheelDelta&&this.$emit("wheelVolumeTrack",!0),-120===e.wheelDelta&&this.$emit("wheelVolumeTrack",!1)}},beforeDestroy:function(){window.removeEventListener("mousemove",this.controlsDragging,!1),window.removeEventListener("mouseup",this.cancelDragging,!1)}},l={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{ref:"track",staticClass:"progress-track",on:{mousedown:function(t){t.preventDefault(),e.dumpTrack(t)},mousewheel:function(t){t.preventDefault(),e.wheelTrack(t)}}},[i("div",{ref:"percent",staticClass:"progress-percent",style:{width:50*e.volume+"px"}}),e._v(" "),i("div",{ref:"control",staticClass:"progress-control",style:{left:50*e.volume-5+"px"},on:{mousedown:function(t){t.preventDefault(),e.bindEvents(t)}}})])},staticRenderFns:[]};var u=i("VU/8")(a,l,!1,function(e){i("bNT2")},"data-v-15325542",null).exports,c={props:{src:{type:String,default:"http://jq22com.qiniudn.com/jq22-sp.mp4"},width:{type:Number,default:700},height:{type:Number,default:400}},components:{durationProgressBar:s,volumeProgressBar:u},data:function(){return{video:null,playOrPause:!0,fullscreen:0,buffer:0,current:0,duration:0,movingTime:0,volume:1,volumeTemp:1,durationScale:0,durationWidth:0,mouseMoving:!1,timer:null,error:!1,canplay:!1}},computed:{playTitle:function(){return this.playOrPause?"播放":"暂停"},volumeTitle:function(){return 0===this.volume?"取消静音":"静音"},fullScreenTitle:function(){return this.fullscreen?"取消全屏":"全屏"}},mounted:function(){var e=this;this.$nextTick(function(){e.durationWidth=e.$refs.durationProgressBar.$el.getBoundingClientRect().width,e.bindFullscreenChange(),window.addEventListener("keydown",e.keydown.bind(e),!1)})},methods:{fullscreenChange:function(){var e=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;this.fullscreen=e?1:0,this.durationWidth=this.$refs.durationProgressBar.$el.getBoundingClientRect().width},bindFullscreenChange:function(){var e=this;["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(function(t){document.addEventListener(t,e.fullscreenChange.bind(e))})},keydown:function(e){if(32===e.keyCode){if(window.event){try{e.keyCode=0}catch(e){}e.returnValue=!1}else e.preventDefault();this.fullscreen&&this.playToggle()}},show:function(){var e=this;this.mouseMoving=!0,clearTimeout(this.timer),this.timer=setTimeout(function(){e.mouseMoving=!1,clearTimeout(e.timer)},2e3)},playToggle:function(){this.playOrPause?(this.video.play(),this.canplay=!0):this.video.pause(),this.playOrPause=!this.playOrPause},volumeToggle:function(){this.volume=0===this.volume?0===this.volumeTemp?1:this.volumeTemp:0},fullScreenToggle:function(){var e=this;if(this.fullscreen)try{["exitFullscreen","mozCancelFullScreen","webkitExitFullscreen","msExitFullscreen"].forEach(function(e){if(e in document)throw document[e](),e})}catch(e){}else try{["requestFullscreen","mozRequestFullScreen","webkitRequestFullscreen","msRequestFullscreen"].forEach(function(t){if(t in e.$refs.player)throw e.$refs.player[t](),t})}catch(e){}},getMovingTime:function(e){this.movingTime=this.duration*e},play:function(){var e=this;setTimeout(function(){e.playOrPause||e.video.play()},20)},pause:function(){this.video.pause()},createPlayer:function(){this.video=this.$refs.video,this.current=this.video.currentTime,this.volume=this.video.volume,this.duration=this.video.duration},onCanplay:function(){this.canplay=!0},onTimeupdate:function(){this.current=this.video.currentTime},onProgress:function(){try{this.buffer=this.$refs.video.buffered.end(0)}catch(e){}},onEnded:function(){this.playOrPause=!0},onError:function(){this.error=!0},onWaiting:function(){this.canplay=!1},onSeeked:function(){this.canplay=!0},dumpVolumeTrack:function(e){this.volume=e,this.volumeTemp=e},wheelVolumeTrack:function(e){e?this.volume+.02<=1&&(this.volume=this.volume+.02):this.volume-.02>=0&&(this.volume=this.volume-.02),this.volumeTemp=this.volume},dumpDurationTrack:function(e,t){this.current=this.duration*e,this.video.currentTime=this.current,"mousemove"===t&&this.pause()},wheelDurationTrack:function(e){e?this.current+2<=this.duration&&(this.current+=2,this.video.currentTime=this.current):this.current-2>=0&&(this.current-=2,this.video.currentTime=this.current)}},filters:{formateTime:function(e){var t=[Math.floor(e/3600),Math.floor(e%3600/60),Math.floor(e%60)],i=t[0],n=t[1],r=t[2];return i=i>=3600?i<10?"0"+i:i:"",n=n<10?"0"+n:n,r=r<10?"0"+r:r,i?i+":"+n+":"+r:n+":"+r},formateVolume:function(e){return Math.floor(100*e)}},watch:{volume:function(e){this.video.volume=e},playOrPause:function(){this.show()}}},v={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{style:{width:e.width+"px",height:e.height+"px"},attrs:{id:"video-player"},on:{mousemove:e.show}},[i("div",{ref:"player",staticClass:"player"},[i("video",{ref:"video",attrs:{id:"video",width:"100%",height:"100%",src:e.src,controls:!1},on:{loadedmetadata:e.createPlayer,progress:e.onProgress,canplay:e.onCanplay,canplaythrough:e.onProgress,timeupdate:e.onTimeupdate,ended:e.onEnded,error:e.onError,waiting:e.onWaiting,seeked:e.onSeeked,click:e.playToggle}},[e._t("source"),e._v("\n      您的浏览器版本过低，并不支持video标签，请升级！\n    ")],2),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!e.canplay||e.error||e.playOrPause,expression:"!canplay || error || playOrPause"}],staticClass:"shadow",on:{click:function(t){t.preventDefault(),e.playToggle(t)}}}),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!e.canplay&&!e.error,expression:"!canplay && !error"}],staticClass:"loading"},[i("div",{staticClass:"circle circle1"}),e._v(" "),i("div",{staticClass:"circle circle2"}),e._v(" "),i("div",{staticClass:"circle circle3"})]),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.playOrPause&&e.canplay,expression:"playOrPause && canplay"}],staticClass:"pausing hover",on:{click:function(t){t.preventDefault(),e.playToggle(t)}}},[i("i",{staticClass:"icon icon-play"})]),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.error,expression:"error"}],staticClass:"error"},[i("p",[e._v("播放源出现问题...")])]),e._v(" "),i("div",{staticClass:"video-controls-wrapper",class:{hover:e.mouseMoving}},[i("i",{staticClass:"btn hover vertical",class:{"icon icon-play":e.playOrPause,"icon icon-pause":!e.playOrPause},attrs:{title:e.playTitle},on:{click:e.playToggle}}),e._v(" "),i("div",{staticClass:"track-progress-bar-wrapper"},[i("duration-progress-bar",{ref:"durationProgressBar",attrs:{bufferScale:e.buffer/e.duration,durationScale:e.current/e.duration,durationLeft:5/e.durationWidth,movingTime:e._f("formateTime")(e.movingTime)},on:{getMovingTime:e.getMovingTime,dumpDurationTrack:e.dumpDurationTrack,cancelDragging:e.play,wheelDurationTrack:e.wheelDurationTrack}})],1),e._v(" "),i("div",{staticClass:"text text-s text-padding vertical"},[i("b",[e._v(e._s(e._f("formateTime")(e.current)))]),e._v("\n        /\n        "),i("b",[e._v(e._s(e._f("formateTime")(e.duration)))])]),e._v(" "),i("i",{staticClass:"btn hover vertical",class:{"icon icon-volume-medium":e.volume>.5&&e.volume<=1,"icon icon-volume-low":e.volume>0&&e.volume<=.5,"icon icon-volume-mute":0===e.volume},attrs:{title:e.volumeTitle},on:{click:e.volumeToggle}}),e._v(" "),i("div",{staticClass:"volume-progress-bar-wrapper"},[i("volume-progress-bar",{attrs:{volume:e.volume},on:{dumpVolumeTrack:e.dumpVolumeTrack,wheelVolumeTrack:e.wheelVolumeTrack}})],1),e._v(" "),i("div",{staticClass:"btn text text-s vertical"},[i("b",[e._v(e._s(e._f("formateVolume")(e.volume)))])]),e._v(" "),i("i",{ref:"fullscreen",staticClass:"btn hover vertical",class:{"icon icon-fullscreen":!e.fullscreen,"icon icon-notFullscreen":e.fullscreen},attrs:{title:e.fullScreenTitle},on:{click:e.fullScreenToggle}})])])])},staticRenderFns:[]};var m={name:"app",components:{player:i("VU/8")(c,v,!1,function(e){i("7/cP")},"data-v-47b0fe9c",null).exports}},d={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("h1",[this._v("vue-h5-video-player")]),this._v(" "),t("player",[t("div",{attrs:{slot:"source"},slot:"source"},[t("source",{attrs:{src:"movie.mp4",type:"video/mp4"}}),this._v(" "),t("source",{attrs:{src:"movie.ogg",type:"video/ogg"}}),this._v(" "),t("source",{attrs:{src:"movie.webm",type:"video/webm"}})])])],1)},staticRenderFns:[]};var h=i("VU/8")(m,d,!1,function(e){i("bGx/")},null,null).exports;i("j1ja");n.a.config.productionTip=!1,new n.a({el:"#app",template:"<App/>",components:{App:h}})},O6K2:function(e,t){},"bGx/":function(e,t){},bNT2:function(e,t){}},[0]);
//# sourceMappingURL=app.f200b7eaa29c9020792c.js.map