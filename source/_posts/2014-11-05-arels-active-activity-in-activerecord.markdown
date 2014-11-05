---
layout: post
title: "Active AREL's Quick Query At ActiveRecord Activity"
date: 2014-11-05 02:38:23 -0500
comments: true
categories: Flatiron&nbsp;School
---
Say that three times fast
<!--more-->

Before I begin to enthuse about the amazingness that is Arel, allow me to make the preliminary introductions. First things first, you meet ActiveRecord, ActiveRecord meet you. Great!

<div style="text-align: center">
  <img src="http://i.imgur.com/7SfPSef.gif">
</div>

ActiveRecord (camelcase) is part of the Ruby on Rails framework, while active record (lowercase) refers to a design pattern for relational databases. In other words, ActiveRecord is the Rails (very!) intelligent implementation of an active record pattern. 

Thanks to the ActiveRecord design pattern, we can retrieve our database data as objects which in turn, allows us manipulate them with object oriented methods, as opposed to handling just static rows of data. Our ActiveRecord objects also come pre-equipped with CRUD methods to create, read, update and delete data. 

Here’s a quick example:

```ruby
user = User.new
user.first_name = “Percy”
user.save
```
This fires

```sql
INSERT INTO users (first_name) VALUES(“Percy”);
```

Much more reasonable, don’t you think? But ActiveRecords smarts go deeper. Say, what if I update his last name and save again? 

```ruby
user.last_name = “Weasley”
user.save
```

This results in the SQL

```sql
UPDATE users SET last_name = “Weasley” WHERE id = user.id;
```

In this new query, ActiveRecord now knows to fire the update instead of the insert command, because it keeps track of the objects and knows this particular one already exists. There’s no need to do another SQL insert, so it fires update instead and knows which row to modify.

With the basic ActiveRecord querying out of the way, let’s move onto the good stuff. Meet <a href="http://www.arelenglish.com/">Arel</a>, the seaman, the captain, and motorboat owner Arel. So Arel was a sailing coach somewhere near Toronto, and he can literally tie knots around you. Amazing, really.

<div style="text-align:center">
  <img src="http://i.imgur.com/5sk8cnL.jpg">
</div>

But that’s not all. There’s ALSO this other ARel, short for ActiveRelation, which is almost as amazing. It’s an object oriented expression of relational algebra (basically a set of operations that take 1 or more relations as input and produce one as output) but that's more easily explained as a simple way to generate complex - <span style="font-style: italic">and I mean complex</span> - database queries. Thanks to ARel, we can chain a series of queries together, much like we do for Ruby methods. ARel handles the complex joins and aggregation and creates one efficient SQL for us. For example:

```ruby
users = User.where(first_name: “Percy”).order(“last_name ASC”).limit(5).include(:posts)
```
would create something like this:

```sql
SELECT users.*, posts.* FROM users LEFT JOIN posts on (users.id = posts.user.id) WHERE users.first_name = “Percy”) ORDER BY last_name ASC LIMIT 5;
```


What's happening here? First, with ActiveRecord, we break the query into segments, and chain them together.  As usual, ActiveRecord queries are lazy, and therefore return relations instead of the actual object. After all, there’s no reason to ask the database to run the query until the last minute. What if we don’t end up using it? Or what if we make it more complex? Since each segment of the querying code above returns a relation object, this is where ARel comes in to put the pieces together and write the SQL statement for the entire thing. 

To clarify, ARel constructs the queries, and ActiveRecord does everything else. Here’s a view of the hierarchy: <span style="font-size:small">(source: <a href="https://twitter.com/camertron">Cameron Dutro</a>)</span> 

<div style="text-align: center">
  <img src="http://i.imgur.com/XWTYQLS.jpg"/>
</div>

In addition, the resulting relations only get executed when it becomes absolutely necessary to know what’s inside them. So, if we pass ```@users = User.limit(5)``` from our controller into our view, we are actually only passing the relation. It is only when we call a method on @users (i.e. ```@users.first.last_name```), that the query is actually run and the relation gets stored as a real Ruby object. Thus, ARel manages the timing for when queries are executed, and queries don’t execute until we actually need them. 

One key thing to remember is that the ```find``` or ```all``` methods are not as lazy as the other query constructs, and those do return the actual record or array of records from the database. Stick to ```where``` so you can maintain the speed and flexibility of our good friend ARel, or conversely, use ```find``` or  ```all``` when you do want to force a relation to evaluate to the actual object. 

<div style="text-align: center">
  <img src="http://i.imgur.com/gUSRwk5.png" height="300px">
</div>

Following in ActiveRecord's footsteps, we developers should be lazy, too; and in our case, this means querying the database as few times as possible. That translates into figuring out what to look for ahead of time, and building a query to return only that result and only one time. Being lazy is a lot of work!

Consider the case when you force a relation return by a query to execute itself immediately, and then continue running additional queries on each member of the collection. Something like this:

``` ruby
User.all.each do |user|
  puts user.city
end
```

In this example, you're grabbing the records for all the users, looping through them, and calling an association on each user (assuming user ```belongs_to :city```).

This results in one query to get all the users and another query for each user to find its associated city for a total of N + 1 queries, where N is your total users. So now we have a potentially giant number of queries eagerly waiting to slow our application down. Uh oh.

(Sidenote: Calling a regular attribute like ```user.first_name``` would not be an issue - it's only because we need to reach into an association that we're forced to run another query each time.)

Fear not. Rails has a solution for this in the form of "eager loading." You can use the ```include``` method in my previous example above, which basically tells ActiveRecord to treat that field as an ordinary attribute. When you chain ```include association``` to your query clauses, ActiveRecords loads the object with the association into memory at the same time, so you don't have to run addition N queries to retrieve that data in the next round. 

<div style="text-align:center">
  <img src="http://i.imgur.com/me17adx.jpg" height="300px">
</div>

ActiveRecord also has a cool feature called scope, where you can create a custom method chain to tack onto your queries like any normal method. For example, if you want your user to be able to filter blog posts, you could do something like this.


```ruby
# in your post.rb file
scope :priority, -> { where(:is_priority => true) }

# in your posts_controller.rb
...
...
def index
  if params[:priority] == true
    @posts = Post.priority.all
  else
    @posts = Post.all
  end
end
...
...
```

In this example, instead of having to rewrite a chain of ActiveRecord methods, we use a scope that contains all the logic and makes the code more readable. And since scopes also return relations objects, we can chain multiple scopes together to get the results you want.

<div style="text-align:center">
  <img src="http://i.imgur.com/CoeT6Qf.jpg">
</div>

