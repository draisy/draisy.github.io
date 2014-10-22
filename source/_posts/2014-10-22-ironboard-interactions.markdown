---
layout: post
title: "Ironboard Interactions"
date: 2014-10-22 02:20:32 -0400
comments: true
categories: Flatiron&nbsp;School
---
In which we iron out our ironboard.
<!--more-->

<p>So, it's just another Monday here at Flatiron, and we're all just minding our own code and doing our little keyboard dances, when suddenly the internet goes down (again!) and we're left bereft. </p>

<div style="text-align:center;"><img src ="http://i.imgur.com/NGx8To6.jpg" alt = "sad pug face" height="500"></div>

<p>But wait! Turns out it's not entirely bad because our new router (I think?) can actually still handle 100 of us. <strong>Whoo!</strong> So while I was 'patiently' waiting my own turn, I came up with this idea to smooth things over for us for the next bout of our wifi's mood swings.</p>

<p>When you run my <a href="https://github.com/draisy/ironboard" target="_blank">script</a> from your command line, it will connect you to ironboard via your terminal, and will automate your interactions with the ironboard application. It allow you to log in with the proper credentials and protections, and will click through the appropriate categories to find the relevant labs and todos. It will scrape today's (or the most recent) schedule, and offer you a choice of all available labs. The lab you select will open directly in github, so you can fork and clone, and get right off the net so other people now have a chance to share in our most precious commodity.</p>

<p>Here's a screenshot of the most recent output as of Tuesday night: <img src = "http://i.imgur.com/R6z9wkh.png" alt="program screenshot" height="650"></p>

In order to make this happen, I used two ruby gems: 1) <a href="https://github.com/sparklemotion/mechanize" target="_blank">Mechanize</a> and 2) Our good old friend <a href="https://github.com/sparklemotion/nokogiri" target="_blank">Nogokiri</a>. Mechanize is an amazing tool for automating web interactions. Since Mechanize actually uses the nogokiri gem internally, we need to ```gem install nogokiri``` before we ```gem install mechanize```, add require 'mechanize' in our files and be on our merry way.

<p>Mechanize is an amazing tool. Here is one quick example:

```ruby
require 'mechanize'
agent = Mechanize.new
page = agent.get('http://google.com/')
google_form = page.form('f')
google_form.q = 'flatiron school'
page = agent.submit(google_form)
pp page
```

That bit of code is creating the mechanize object, fetching the google homepage, grabbing the search form off the page, inserting flatiron school into the search field, submitting the request, and 'pretty printing'
the results. Amazing, don't you think? 

<p>And for further examples, here are some snippets of the script I created</p>
```ruby
  def initialize
   @agent = Mechanize.new
   @page = @agent.get('http://learn.flatironschool.com')
   login(@page)
  end

  def login(page)
    page = @agent.page.link_with(:text => 'Login').click
    login = page.form_with(:action => "/session")

    username_field = login.field_with(:name => "login")
    username = ask("Please enter your (github) username:  ") { |x| x.echo = true }
    username_field.value = username

    password_field = login.field_with(:name => "password")
    password = ask("Enter password:  ") { |x| x.echo = false }
    password_field.value = password

    puts "Thank you. Please wait a moment while we download the latest schedule.\n"
    @logged_in = login.submit login.button
  end
```  

<p>Upon instantiation of my ironboard class, I create a new mechanize object, fetch the ironboard homepage, and pass the page into my login function. The first line of my login function scans the page for a link that contains the text 'Login', and calls the click action on it. The second line scans that resulting page and returns the login form we will need to enter our credentials. The ```link_with``` and ```form_with``` are both mechanize functions that accept a hash parameter that define the critera to search for. I found those critera by inspecting the elements and viewing the source code of the ironboard page from the browser window.</p>

<p>The function continues to search for the appropriate login and password fields and I used the <a href="https://github.com/JEG2/highline" target ="_blank">highline</a> gem to get the username to hide the password from terminal view. I assign the values to the fields and call the submit function on my form variable. Tada! I now have a @logged_in page from where I can access all the goodies ironboard has to offer.</p>


```ruby
  def get_schedule
    @schedule = @logged_in.links_with(:href =>/daily-schedules/).last.click
    puts @schedule.search('div#daily-schedule h1').first.text 
  end

  def display_plan
    puts "\n******THE PLAN******"
    @rows = @schedule.search('tbody tr')
    @rows.each {|row| puts "#{row.text}"}
  end
```

<p>In these methods, I use mechanize to search through all the links that include 'daily-schedules' in the URL, and select the last one (aka the most recent) to click. Then, I use nogokiri to display the welcome greeting for the day. The display method also uses nogokiri to parse the html table that contains the plan and todos for the day.</p>

```ruby
  def display_labs
    @labs_title = @schedule.search('div#daily-schedule h1')[1]
    @labs_title = @schedule.search('div#daily-schedule h2').first if !@labs_title
    puts "\n******THE #{@labs_title.text.upcase}******"
    @labs_title.next_sibling.next.search('li a').each {|l| puts l.text}
    puts "*********************"
  end
```
<p>Guess what display_labs does? It displays labs! Shocker, I know. So again, I use nogokiri to find the labs on the page, but I need to include that if statement, because some schedules display the titles as ```<h1>``` and some use ```<h2>```. Don't ask me why.


```
  def get_link(input)
    lesson = @logged_in.links_with(:href =>/lessons/)[input -1].click
    get_github_page(lesson)
  end

  def get_github_page(lesson)
    github = lesson.links_with(:href => /github.com\/flatiron-school-ironboard/).first.href
    open "#{github}"
  end
```
<p> And finally, I take my user input and fire back a lesson variable that contains the appropriate link for the user's selection. Initially, I had used nogokiri here too, and created a complicated hash and nested collect methods to find these values, until I smacked myself on the head and returned to my mechanize behaviors. The ```links_with``` method simply returns an array of all the results, so I select the first one, and grab the href value. My ```get_github_page``` uses the same method to find the github link within the new lesson page, and then sends the command to open it in your browser.</p>

<p>So there you have it. Ironboard for terminal is now available for all! I still want to flesh this out with some more functionality, but in the meantime, here's the <a href="https://github.com/draisy/ironboard" target="_blank">github link</a> where I welcome any forks and pulls that come my way.







