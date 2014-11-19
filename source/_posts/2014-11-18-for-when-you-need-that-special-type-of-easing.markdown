---
layout: post
title: "For When You Need That Special Type of Easing"
date: 2014-11-18 23:05:32 -0500
comments: true
categories: Flatiron&nbsp;School
---
Hat tip to <a href="https://www.linkedin.com/pub/jimmy-kuruvilla/21/505/972">Jimmy</a> for the inspiration behind this fun post. 
<!--more-->
Yesterday was an awesome day at Flatiron. First, we got to view an in-depth, behind-the-scenes coverage of the Flatiron precollege program. Then, we were inundated with an exceptionally detailed finance and data analytics talk by BlackRock's own Andrew Rothstein. Of course, we also got to meet and chat with John Resig of jQuery and Khan Academy fame - a massive honor. And to top it all off, we were even introduced to the jQuery easing effects, as Jimmy so eloquently put it "for when you need that special type of easing."

Intrigued by all the easing possibilities, I set out to find a fun application to test the waters. After playing around with basic SVG paths, I bumped into a cool tutorial by <a href="http://dropthebit.com/">Yair Even-Or</a> which basically creates an object that seemingly traverses a maze as it animates around a hidden svg path.

Here's a demo of my implementation of his script:
<iframe src="http://mnsny.com/maze/maze.html" name="targetframe" allowTransparency="true" scrolling="no" frameborder="0" width="1200px" height="650px" style="margin-top:-30px" >
    </iframe>

So what's going on here? With the help of <a href="http://www.mazegenerator.net/">Maze Generator</a>, I created two SVG images: one for the maze, and one for the maze + solution. I then grabbed the polyline point values of the red line within the solution file and converted it to an SVG path. My next step was to create a bunch of DOM elements and call this cool <a href="https://github.com/yairEO/pathAnimator">Path Animator</a> script to move my elements along this new path. 

Quick overview of Path Animator functionality:
```javascript
var path = "M150 0 L75 200 L225 200 Z"; 
    pathAnimator = new PathAnimator( path ), 
    speed = 6,       
    reverse = false,
    startOffset = 0,      
    easing = function(t){ t*(2-t) }; 

pathAnimator.start( speed, step, reverse, startOffset, finish, easing);

function step( point, angle ){
}

function finish(){
}
```
<ul>
  <li>Create an SVG path</li>
  <li>Initiate PathAnimator object</li>
  <li>Set seconds it will take to complete entire path</li>
  <li>Direction of path</li>
  <li>From 0-100%, beginning to end</li>
  <li>Finally, the easing functionality!</li>
</ul>
Then you call start on the instance and it proceeds to the step function. The step function is where the 'magic' actually happens and it contains the action to occur with every 'frame'. In our case, we want to change the point.x, point.y and angle for every move. The finish function then gets called when the animation is done. 

Here are some actual snippets from the code of this implementation:
```javascript
var path = "M205,1.9999999999999822 205,15.124355652982123 247,41.3730669589464 247,15.124355652982123 289,41.3730669589464 268,54.497422611928542 268,80.74613391789282 247,67.621778264910674 247,93.870489570874966 289,120.11920087683923 289,67.621778264910674 310,54.497422611928542 310,28.248711305964264 331,41.3730669589464 373,15.124355652982123 394,28.248711305964264 415,15.124355652982123 415,67.621778264910674 394,80.74613391789282 415,93.870489570874966 415,198.86533479473209 394,185.74097914174996 352,211.98969044771422 331,198.86533479473209 331,172.61662348876783 352,185.74097914174996 373,172.61662348876783 373,146.36791218280354 394,159.49226783578567 394,106.99484522385711 373,93.870489570874966 331,120.11920087683923 331,146.36791218280354 268,185.74097914174996 289,198.86533479473209 289,225.11404610069639 247,251.36275740666068 268,264.48711305964281 247,277.61146871262491 268,290.73582436560707 289,277.61146871262491 331,303.86018001858918 331,251.36275740666068 352,238.23840175367852 373,251.36275740666068 373,330.1088913245535 352,343.23324697753566 352,369.48195828349992 373,382.606313936482 310,421.97938089542851 331,435.10373654841061 331,461.35244785437487 352,474.47680350735703 331,487.60115916033919 310,474.47680350735703 310,448.22809220139277 268,474.47680350735703 247,461.35244785437487 247,435.10373654841061 205,461.35244785437487 184,448.22809220139277 184,474.47680350735703 226,500.72551481332135 205,513.84987046630351 226,526.97422611928562 226,540.09858177226772"; //super crazy SVG path!
firstWalkerObj = $('.maze > .walker')[0],
walkers = [];
 ...
 ...
   step : function(point, angle){
    this.walker.style.cssText = "top:" + point.y + "px;" + 
                  "left:" + point.x + "px;" + 
                  "transform:rotate(" + angle + "deg);" +
                  "-webkit-transform:rotate(" +  angle + "deg);" +
                  "color:" + this.color;
  },   
...
...
   finish : function(){ //restarts maze when it's done
      this.start(); 
    },

```
Just for fun, here's the overview for the methods needed for all the controller functionality:
```javascript
  $('#showPath').on('change', togglePath);
  $('#addWalker').on('click', addWalker);
  $('menu')
    .on('click', '.delete', removeInstance)
    .on('click', '.stopPlay', stopPlay)
    .on('click', '.reverse', switchDirection)
    .on('change', '.speed', changeSpeed)
    .on('change', 'select', changeEasing);
    
  $('.speed').trigger('change');
```
And to bring this full circle, here's how the special type of easing is happening:
```javascript
  function changeEasing(){
    var thisAnimatedWalker = $(this.parentNode).data('walker'),
      easingFunc = ''; 
      
    if( this.value ){
      var formula = this.value;
      easingFunc = function(t){ return eval(formula) }; 
    }
    
    thisAnimatedWalker.easing = easingFunc;
    thisAnimatedWalker.resume.apply(thisAnimatedWalker);
  }
```
The functionality is contained within the select box on the html page, in the value attribute for each option.
```html
 <select>
    <option value=''>No Easing</option>
    <option value='Math.pow(t,3)'>easeInCubic</option>
    <option value='1-Math.pow(1-t,3)'>easeOutCubic</option>
    <option value='Math.pow(2,-10*t) * Math.sin((t-2/4)*(2*Math.PI)/2) + 1'>easeOutElastic</option>
    <option value='t*t'>easeInQuad</option>
    <option value='t*(2-t)'>easeOutQuad</option>
    <option value='t<.5 ? 2*t*t : -1+(4-2*t)*t'>easeInOutQuad</option>
    <option value='t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t'>easeInOutQuart</option>
</select>
```
These equations are derived from the jQuery <a href="http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js">source code</a> and the javascript evals each of them as they are selected by the user. 
<div style="text-align:center">
  <img src="http://i.imgur.com/2tPtLgt.jpg"/><br/>
  <p style="font-size:20px"><strong>Don't forget to thank Jimmy if you enjoyed this as much as I did!</strong></p>
</div>

