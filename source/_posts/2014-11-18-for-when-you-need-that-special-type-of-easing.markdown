---
layout: post
title: "For When You Need That Special Type of Easing"
date: 2014-11-18 23:05:32 -0500
comments: true
categories: Flatiron&nbsp;School
---
Hat tip to Jimmy for the inspiration behind this fun post. 
<!--more-->
Yesterday was an awesome day at Flatiron. First, we got to view an in-depth, behind-the-scenes coverage of the Flatiron precollege program. Then, we were inundated with an exceptionally detailed finance and data analytics talk from the talented Andrew etc from Blackrock. Of course, we also got to meet and chat with John Resig of jQuery and Khan Academy fame - a massive honor. And to top it all off, we were even introduced to the jQuery easing effects, as Jimmy so eloquently remarked "for when you need that special type of easing."

Intrigued by all the easing possibilities, I set out to find a fun application to test the waters. After playing around with basic SVG paths, I bumped into a cool tutorial by <a href="http://dropthebit.com/">Yair Even-Or</a> which basically creates an object that traverses a maze as it animates around a hidden svg path.

Here's a demo of my implementation of his script:
<div id="maze-page"></div> 


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> 
<script> 
$(function(){
  $("#includedContent").load("maze.html"); 
});
</script>