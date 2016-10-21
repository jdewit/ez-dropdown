EZ-DROPDOWN
===========

This is a fork of the <a href="https://github.com/angular-ui/bootstrap">angular-ui bootstrap dropdown</a>. 

One big difference with this directive is that the dropdown menu is not compiled until the dropdown toggle is clicked. This improves performance if you have dropdowns inside a big fat ng-repeat.

On small screen sizes (<768px) the dropdown transforms into a full screen modal.

###Demo

View <a href="http://cdn.rawgit.com/jdewit/ez-dropdown/master/demo.html">DEMO</a>.

###Installation

1. Install with bower 
```
$ bower install ez-dropdown 
```

2. Add script 
```
<script src="bower_components/ez-dropdown/dist/ez-dropdown.min.js"/> 
```

3. Add to your apps module 
```
angular.module('yourApp', ['ez.dropdown']) 
```

###Usage

```html
 <span dropdown>
   <a dropdown-toggle>Dropdown that closes on click</a>
   <ul dropdown-menu>
     <li><a href="#">Hey</a></li>
   </ul>
 </span>
```

###Config Attributes

Add the following attributes to the 'dropdown' element for custom behaviour:

- ```on-toggle="someFn"``` call a function

- ```click-inside="true"``` prevent auto closing dropdown on click inside dropdown menu

- ```no-backdrop="true"``` prevent backdrop from appearing in mobile mode

- ```mobile-disabled="true"``` disable mobile mode

###Helper Classes

Add the following classes to the 'dropdown' element for custom styling

- ```class="dropdown dropdown-select"``` show radio inputs beside options in mobile mode with border on the bottom

Add the following classes to the 'dropdown-menu element for custom styling

- ```class="dropdown-menu dropdown-pointer"``` show a pointer arrow on the top of the dropdown menu

