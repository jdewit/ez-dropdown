EZ-DROPDOWN
===========

This is a fork of the <a href="https://github.com/angular-ui/bootstrap">angular-ui bootstrap dropdown</a>. 

The angular-ui-bootstrap project is too complicated. I think it would be better suited to split all of the components into individual repos. 

###Installation

```
$ bower install ez-dropdown
```

```js
<script src="bower_components/ez-dropdown/dist/ez-dropdown.min.js"/>
```

```js
angular.module('yourApp', ['ez.dropdown'])
```

###Usage

default
```html
 <span class="dropdown">
   <a href="#" class="dropdown-toggle">Dropdown that closes on click</a>
   <ul class="dropdown-menu">
     <li><a href="#">Hey</a></li>
   </ul>
 </span>
```

call function on toggle with ```on-toggle``` attribute
```html
 <span class="dropdown" on-toggle="toggled(open)">
   <a href="#" class="dropdown-toggle">Dropdown that calls toggled function on toggle</a>
   <ul class="dropdown-menu">
     <li><a href="#">Yo</a></li>
   </ul>
 </span>
```

prevent auto closing on click inside with ```click-inside``` attribute
```html
 <span class="dropdown" click-inside="true">
   <a href="#" class="dropdown-toggle">Dropdown that stays open on click inside!</a>
   <ul class="dropdown-menu pull-right">
     <li><a href="#">Hey dude</a></li>
   </ul>
 </span>

```

###Pointer Arrow
Include the ```dist/ez-dropdown.min.css``` stylesheet to add the pointer arrow to your dropdown. 

Add the ```dropdown-pointer``` class to the dropdown menu for it to take effect. 

###Demo

View <a href="http://cdn.rawgit.com/jdewit/ez-dropdown/master/index.html">DEMO</a>.
