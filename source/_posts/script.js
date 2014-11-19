/*----------------------------------------------------------
  Page Configuration
-----------------------------------------------------------*/
(function(){
var path = "M205,1.9999999999999822 205,15.124355652982123 247,41.3730669589464 247,15.124355652982123 289,41.3730669589464 268,54.497422611928542 268,80.74613391789282 247,67.621778264910674 247,93.870489570874966 289,120.11920087683923 289,67.621778264910674 310,54.497422611928542 310,28.248711305964264 331,41.3730669589464 373,15.124355652982123 394,28.248711305964264 415,15.124355652982123 415,67.621778264910674 394,80.74613391789282 415,93.870489570874966 415,198.86533479473209 394,185.74097914174996 352,211.98969044771422 331,198.86533479473209 331,172.61662348876783 352,185.74097914174996 373,172.61662348876783 373,146.36791218280354 394,159.49226783578567 394,106.99484522385711 373,93.870489570874966 331,120.11920087683923 331,146.36791218280354 268,185.74097914174996 289,198.86533479473209 289,225.11404610069639 247,251.36275740666068 268,264.48711305964281 247,277.61146871262491 268,290.73582436560707 289,277.61146871262491 331,303.86018001858918 331,251.36275740666068 352,238.23840175367852 373,251.36275740666068 373,330.1088913245535 352,343.23324697753566 352,369.48195828349992 373,382.606313936482 310,421.97938089542851 331,435.10373654841061 331,461.35244785437487 352,474.47680350735703 331,487.60115916033919 310,474.47680350735703 310,448.22809220139277 268,474.47680350735703 247,461.35244785437487 247,435.10373654841061 205,461.35244785437487 184,448.22809220139277 184,474.47680350735703 226,500.72551481332135 205,513.84987046630351 226,526.97422611928562 226,540.09858177226772";
    firstWalkerObj = $('.maze > .walker')[0],
    walkers = [];
  
  // handles whatever moves along the path
  function AnimateWalker(walker){
    this.pathAnimator = new PathAnimator( path );
    this.walker = walker;
    this.reverse = false;
    this.speed = 40;
    this.easing = '';
    this.startOffset = 50;
    this.color = 'deeppink'; // visually separate different walkers easily
  }

  AnimateWalker.prototype = {
    start : function(){
      //this.walker.style.cssText = "";
      this.startOffset = (this.reverse || this.speed < 0) ? 100 : 0; // if in reversed mode, then animation should start from the end, I.E 100%
      this.pathAnimator.context = this; // just a hack to pass the context of every Walker inside it's pathAnimator
      this.pathAnimator.start( this.speed, this.step, this.reverse, this.startOffset, this.finish, this.easing);
    },

    // Execute every "frame"
    step : function(point, angle){
      this.walker.style.cssText = "top:" + point.y + "px;" + 
                    "left:" + point.x + "px;" + 
                    "transform:rotate(" + angle + "deg);" +
                    "-webkit-transform:rotate(" +  angle + "deg);" +
                    "color:" + this.color;
    },

    // Restart animation once it was finished
    finish : function(){
      this.start();
    },

    // Resume animation from the last completed percentage (also updates the animation with new settings' values)
    resume : function(){
      this.pathAnimator.start( this.speed, this.step, this.reverse, this.pathAnimator.percent, this.finish, this.easing);
    }
  }

  function generateWalker(walkerObj){
    var newAnimatedWalker = new AnimateWalker( walkerObj );
    walkers.push(newAnimatedWalker);
    return newAnimatedWalker;
  }

  // start "animating" the first Walker on the page
  generateWalker(firstWalkerObj).start();
  // bind the first Controller to the first Walker
  var firstController = $('menu > div:first');
  resetController( firstController );
  firstController.data( 'walker', walkers[0] );

/*-----------------------------------------------------------
  User Controls
------------------------------------------------------------*/
  $('#showPath').on('change', togglePath);
  $('#addWalker').on('click', addWalker);
  $('menu')
    .on('click', '.delete', removeInstance)
    .on('click', '.stopPlay', stopPlay)
    .on('click', '.reverse', switchDirection)
    .on('change', '.speed', changeSpeed)
    .on('change', 'select', changeEasing);
    
  $('.speed').trigger('change');
  
  // show / hide the path of the animated object
  function togglePath(){
    $('#svgPath').toggleClass('show');
  }
  
  // add a new instance Walker and his controller box
  function addWalker(){
    var newWalker = firstWalkerObj.cloneNode(true),
      controllerTemplate = $('menu > div:last'),
      controllerClone = controllerTemplate.clone(),
      newAnimatedWalker = generateWalker(newWalker),
      color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    
    resetController( controllerClone );
    controllerTemplate.after( controllerClone.css('borderColor', color) );
    
    $(firstWalkerObj).after(newWalker);

    controllerClone.data('walker', newAnimatedWalker);  // keep track which controller controls which walker
    newAnimatedWalker.color = color;
    newAnimatedWalker.start();
  }
  // reset the controller box for new "walker" instances
  function resetController(obj){
    var speed = 30;
    obj.find('.speed').val(speed).next().text(speed + 's');
    obj.find(':checkbox').removeAttr('checked');
  }
  
  // pause or place the animated object along the path 
  function stopPlay(){
    var thisAnimatedWalker = $(this.parentNode.parentNode).data('walker');
    
    thisAnimatedWalker.pathAnimator.running ? thisAnimatedWalker.pathAnimator.stop() : thisAnimatedWalker.resume.apply(thisAnimatedWalker);
  }
  
  // switch direction of the animated object 
  function switchDirection(){
    var thisAnimatedWalker = $(this.parentNode.parentNode).data('walker');
    thisAnimatedWalker.reverse = (thisAnimatedWalker.reverse == true) ? false : true;
    if( thisAnimatedWalker.pathAnimator.running )
      thisAnimatedWalker.resume.apply(thisAnimatedWalker);
  }

  function changeSpeed(){
    var thisAnimatedWalker = $(this.parentNode).data('walker');
    thisAnimatedWalker.speed = this.value;
    this.nextElementSibling.innerHTML = this.value + 's';
    thisAnimatedWalker.resume.apply(thisAnimatedWalker);
  }

  function removeInstance(){
    var parent = $(this.parentNode),
      thisAnimatedWalker = parent.data('walker');
    
    // make sure at least one Walker stays
    if( walkers.length > 1 ){
      parent.remove();
      thisAnimatedWalker.pathAnimator.stop();
      $(thisAnimatedWalker.walker).remove();
      walkers.splice(walkers.indexOf(thisAnimatedWalker), 1);
    }
  }
  
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
  
  // reset checkboxes
  $(':checkbox').removeAttr('checked');
  $('select').prop('selectedIndex', 0);
})();


// var pathAnimator = new pathAnimator(path);
// var player = $('player');
// var speed = 6;
// var reverse = false;
// var startOffset = 0;

// pathAnimator.start( speed, step, reverse, startOffset, finish);

// function step( point, angle ){
//   // do something every "frame" with: point.x, point.y & angle
//   player.style.cssText = "top:" + point.y + "px;" +
//                 "left:" + point.x + "px;" +
//                 "transform:rotate("+ angle +"deg);" +
//                 "-webkit-transform:rotate("+ angle +"deg);";
// }

// function finish(){
//   // do something when animation is done
// }