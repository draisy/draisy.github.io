---
layout: post
title: "I don't mean to pry"
date: 2014-10-07 01:59:30 -0400
comments: true
categories: Flatiron&nbsp;School
---
But really, I do. 
<!--more-->

Let's be honest Ruby folks, sometimes we just need to pry. I know it doesn't sound
pretty, but let's face it, how else are we going to know the inner workings of our
all our nearest and dearest Ruby programs? Don't tell me you're not DYING to know 
exactly why that pesky bug is keeping all your tests from passing. Oh, and don't get me started on those tests right now...back to pry. 

<p>Let's pry!</p>

<p>For the purpose of this mini tutorial, I'm going to assume you have pry installed
on your machine, but if you don't, go ahead and watch this nifty little video <a href="http://vimeo.com/26391171">here</a>, and come right back when you're done.</p>

<p>All right. Moving on.</p>

<p>So you're working on your nested (or more like nested[nested][more-nested][inner-nested][and-one-more-for-good-measure-nested] )hash method, and try as you might, you're getting everything but the values you really need. This is where our good friend pry comes to shine.</p>

<p>Here's a snippet of code from our latest Hashketball game. (Super fun game, guys. We should play it more often).</p>
``` ruby
def player_numbers(team_name)
  game_hash.each do |team, game_data|
    if game_data[:team_name] == team_name
      return game_data[:players].collect do |player|
        player[:number]
      end
    end
  end
end
```

It's pry-time! First, make sure you have ```require 'pry'``` included in your file. Second,
put ```binding.pry``` somewhere within that loop, to get an inside view of your variables at work. Something like this:
``` ruby
def player_numbers(team_name)
  game_hash.each do |team, game_data|
    if game_data[:team_name] == team_name
      binding.pry #this line - right here
      return game_data[:players].collect do |player|
        player[:number]
      end
    end
  end
end
```
And that's it! At this point, when you run your program from the command line, as soon as your loop evaluates to that line, it will break into the pry console. And now you can enter ```game_data[:team_name]``` directly in the console while your program is running, and see the values it actually contains. Who knows, maybe it's your lucky day and everything contains what you think it should, and there's no nil (or implicit or Fixnum or String or...) conversion errors of any variety whatsoever.

<strong> Bonus ProTip for those of you reading till the end:</strong><br/>
  Unlike irb, pry doesn't just quit when you type ```exit```. Nope, in the pry console, 'exit' means I'm done evaluating this line of code, please move on. So each time you type 'exit', pry simply moves on to evaluate the next line or expression in code. So how to quit without hiting the ctrl + C multiple times in frustration? You quit with a bang, like so! ```quit!``` 

  <strong>Bonus Protip #2:</strong><br/>
  When pry sends a long, multiline value to your console, you need to display the entire thing before you can continue. You can do this the long way, by hitting ```enter``` repeatedly as each line shows up, or you can type ```wq```  (for write quit) so the entire value displays at once, and you can continue.

  <p> And this is why I love pry. You can't pry pry away from me. Because as it turns out, sometimes it IS ok to pry.</p> 