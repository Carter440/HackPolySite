/*
 * MusiclyGen v1.0.0 2-7-16
 * https://github.com/carter440/HackPoly
 * Copyright (c) 2016 Carter Slocum
 */
window.requestAnimFrame = (function(callback){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(callback, element){
				window.setTimeout(callback, 1000/ 60);
			};
})();

var spectree = function(size, leaves, X, Y, uni){
    this.size = size;
    this.leaves = leaves;
    this.X = X;
    this.Y = Y;
    this.tallness = this.size*8;
    this.unique = uni;
    if(this.tallness > this.unique*2)
    this.tallness -= this.unique*2;
}

spectree.prototype = {
    size: 0,
    leaves: 0,
    X: 0,
    Y: 0,
    tallness: 0,
    unique: 0,
    draw: function(ctxt){
        ctxt.lineWidth = 30 +Math.floor(this.unique);
        ctxt.strokeStyle = "#4d2600";
        ctxt.beginPath();
        ctxt.moveTo(this.X,this.Y);
        ctxt.lineTo(this.X,this.Y-(this.tallness+1));
        ctxt.stroke();
        ctxt.beginPath();
        ctxt.lineWidth = 6;
        ctxt.strokeStyle = "rgba(0,102,0,1)";
        for(var j = 0; j < this.size; j++){
            ctxt.moveTo(this.X-(Math.sqrt(this.leaves[j])*600), this.Y-((1+j/(1+ this.size))*this.tallness));
            ctxt.lineTo(this.X+(Math.sqrt(this.leaves[j])*600), this.Y-((1+j/(1+ this.size))*this.tallness));
        }
        ctxt.stroke();
    },
    move: function(dist){
    this.X -= dist;
}
}

$(document).ready(function() {
    var subutt = document.getElementById("submitfile");
    var modwav = document.getElementById("waveses");
    var modtre = document.getElementById("treeses");
    var subfile = document.getElementById("filetosub");
    var music = document.getElementById("music");
    var canvas = document.getElementById("can");
    canvas.width = 1000;
    canvas.height = 1000;
    var ctx = canvas.getContext("2d");
    var forrest = [];
    var treeTime = 0;
    var avg = 0;
    var mode;
    ctx.strokeStyle= "rgba(0,0,0,1)";
    ctx.lineWidth= 2;
    
    var dancer;
    subutt.onmousedown = function(){
        subutt.style.backgroundColor = "black";
    }
    subutt.onmouseup = function(){
        subutt.style.backgroundColor = "white";
    }
    subutt.onmouseout = function(){
        subutt.style.backgroundColor = "white";
    }
    
    function degreenify(){
        modtre.style.backgroundColor = "#FFFFFF";
    }
    
    function deredden(){
        modwav.style.backgroundColor = "#FFFFFF";
    }
    
    modwav.onclick = function(){
        modwav.style.backgroundColor = "#FF0000";
        wavey = true;
        degreenify();
    }
    
    modtre.onclick = function(){
        modtre.style.backgroundColor = "#00FF00";
        wavey = false;
        deredden();
    }
    subutt.onclick=function(){
        if(subfile.files.length > 0 && wavey !== undefined){
            degreenify();
            deredden();
            $("#filetosub").hide(500, function(){$(".butt").hide(500, function(){$(".topin").slideUp(500)});});
       var sorce = document.createElement("SOURCE");
 sorce.setAttribute("src",URL.createObjectURL(subfile.files[0]));
        music.appendChild(sorce);
        dancer = new Dancer();
        dancer.load(music);
        dancer.play();
        if(wavey){setTimeout(function(){var startTime = (new Date()).getTime();animate(startTime)}, 0)}else{
        setTimeout(function(){var startTime = (new Date()).getTime();animateForrest(startTime)}, 300)
        }
    }
    }
    function wave(){
        var freak = dancer.getWaveform();
        ctx.fillStyle="rgba(255,255,255, 0.5)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        for(var i = 0; i < 1024; i++){
        ctx.moveTo((i/1024)*canvas.width,canvas.height);
        ctx.lineTo((i/1024)*canvas.width,canvas.height - ((Math.abs(freak[i]))* (canvas.height*0.9)));
        }
        ctx.stroke();
    }
    function animate(startTime){
        wave();
        requestAnimFrame(function(){
            animate(startTime);
        });
    }
    function animateForrest(startTime){
        ctx.fillStyle="rgba(255,255,255, 0.6)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        if(treeTime <= 0){
        avg = dancer.getFrequency(3,21)*100;
        treeTime = 50 - Math.floor(Math.sqrt(avg*350));
        if(treeTime < 14){
            treeTime = 14;
        }
        var freak = dancer.getSpectrum();
        var siz = 16+Math.floor(Math.sqrt(avg* 300));
        forrest.push(new spectree(siz,freak.slice(4,4+siz),canvas.width,canvas.height, avg));
        }
        treeTime -= 1;
        for(var st = 0; st < forrest.length; st++){
            if(forrest[st].X >=-25){
            forrest[st].move(20);
            forrest[st].draw(ctx);
            }else{
                forrest.splice(st,1);
            }
        }
        requestAnimFrame(function(){
            animateForrest(startTime);
        });
    }
});