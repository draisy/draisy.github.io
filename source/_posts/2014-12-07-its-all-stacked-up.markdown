---
layout: post
title: "It's All Stacked Up"
date: 2014-12-07 01:47:09 -0500
comments: true
categories: java,&nbsp;data&nbsp;structures,&nbsp;stacks,&nbsp;queues
---

How to implement a stack based using two queues?
<!--more-->

This question was posed to me on Friday, and while I didn't get it right on my first try, it remained stuck in my head till now, when I finally talked myself through it and resolved the problem. 

As a quick refresher, the stack is LIFO (last in first out) data structure and a queue is FIFO (first in first out). That translates into the meaning the last element added to the stack is the first one to be removed, and the first element added to the queue is the first to be removed.

<div style="text-align:center">
  <img src="http://i.imgur.com/sr4Nnlc.jpg"/>
</div>

So how can you actually implement the stack structure while using two queues? My first thought was to simply push each element into both the stack and the first queue at the same time. Then when we call pop, the program will dequeue the n-1 elements from queue1 into queue2, and we would be left with just one final element on queue1 which you could pop to achieve the same result like calling pop on stack. 

OK...maybe? But then I thought of the follow up: what if you call pop twice in a row? How do you access the n-2nd element as well? You would essentially have one empty queue and another still in FIFO order at that point in time. You would either need to tell your program that queue1 is now queue2 and vice versa (so that we would pop from the filled queue and push into the empty one), or immediately return the elements from queue2 to queue1 after the operation. 

Or, instead of the overhead in the pop method, we could go ahead and make the push method more costly. So instead of simply pushing all elements immediately into queue1, we push the new element into queue2, pop all the existing elements from queue1 to queue2, and then move all the elements (or swap pointers) back to queue1, so that the newly pushed item is at the front to be popped first. 

Here is some pseudocode of my thought process:
```java
/* Method 1: (push heavy) */

For push:
  1) Enqueue new element to queue2
  2) Dequeue existing elements from queue1 and enqueue to queue2.
  3) Move all elements from queue2 back to queue1 or swap pointers

And now pop:
  1) Dequeue an item from queue1 and return it.

/* Method 2: (pop heavy) */

For push:
1) Enqueue new element to queue1

For pop:
  1) Dequeue n-1 elements from queue1 to queue2. 
  2) Dequeue the last item of queue1, and save the value
  3) Return all elements from queue2 to queue1 or swap names
  4) Return value stored in step 2.

```

Assuming we'd also want to implement a ```peek()``` method, I proceeded with method1 and left the push function to be the costly one. My next step was to refine the functionality of ```push(int)```. I chose to proceed with the additional step of moving elements back to previous queue after an operation as opposed to swapping pointers, because I was thinking that creating a temp queue as placeholder to swap by reference might possibly count towards a third queue and thus break the constraints of this problem.

So, we can go ahead and push into queue1 directly when it is empty, but otherwise, we will first dequeue all existing elements from queue1 to queue2, add the new element to queue1 and then return the previous elements from queue2 to queue1. At this point, we should always be able to pop from queue1. Here is some further pseudocode for this version of push:



```
Create two queues
For the push method:
    If the size of queue1 == 0 then
        we enqueue new value into queue1
    Else
        we dequeue all elements from queue1 to queue2
        enqueue new value into queue1
        dequeue all previous elements from queue2 to queue1
 
For the pop method:
    If the size of queue1 = 0 then
       we throw 'underflow' error
    Else 
        we return front element of queue1
```
And finally, here's a java implementation of this solution:


```java
class StackWithTwoQueues
{
    Queue<Integer> queue1;
    Queue<Integer> queue2;
 
    public StackWithTwoQueues()
    {
        queue1 = new LinkedList<Integer>();
        queue2 = new LinkedList<Integer>();
    }    

    public void push(int value)
    {
      
        if (queue1.size() == 0)
            queue1.enqueue(value);
        else
            int length = queue1.size();
            for (int i = 0; i < length; i++)
                queue2.enqueue(queue1.dequeue());                

            queue1.add(value);        
               
            for (int i = 0; i < length; i++)
                queue1.enqueue(queue2.remove());
        }
    }

    public int pop()
    {
        if (queue1.size() == 0)
            throw new NoSuchElementException("Underflow Exception");        
        return queue1.remove();
    }
}          
```

In our case, queue2 will always be null at the end of any operation, and queue1 will always contain the correct stack order of elements.
