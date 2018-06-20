# PowerBI Custom Visual Navigation Menu
A custom visual for simulating a tiled navigation menu:

![menu.png](menu.PNG)

This custom visual enables navigation to pages in an embedded report.
It's a sample to proove the concept and it's work in progress.

The menu is defined by a dataset specifying the title, icon, background color and navigation page.

The correct data structure is not yet read from the custom properties - there aren't any - and the field names are used at this moment. If you want to use this, just take a look at the field name mapping. It should be made by using custom properties and/or data mapping. 
The label shown above the tiles describe the number of records that are passed to the custom visual. Please fill the "categories" and "measure data" fields in order to display any data.

Please check https://tsmatz.wordpress.com/2016/09/27/power-bi-custom-visuals-programming/ for detailed instructions on how to build a custom visual.