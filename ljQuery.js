// Name: Super-lightweight jQuery implementation - ljquery
// Author: Tomas Novella (novellizator.cz)
// Date: 2013/8/10
// Purpose: Learn something about javascript in regard of classes and closures


function $_ljquery(val)  
{
	var byId = document.getElementById(val);	
	if (byId) 
	{
		return new SetOfElements([byId]);
	}
	

	// Note: JS returns true on empty array!!!
	var byTagNameArray = document.getElementsByTagName(val);
	if (byTagNameArray.length != 0) 
	{	
		return new SetOfElements(byTagNameArray);
	}
	
	
	var byClassNameArray = document.getElementsByClassName(val);
	if (byClassNameArray.length != 0) 
	{	
		return new SetOfElements(byClassNameArray);
	}
	
	return;

	
}

//
// Single Element
//
function SingleElement(el)
{
	this.node = el;
}

SingleElement.prototype.getPublicMethods = function()
{
    var res = [];
    for(var m in this) {
        if(typeof this[m] == "function" && m != "getPublicMethods") {
            res.push(m)
        }
    }
    return res;
}

// default helper ;-)
SingleElement.prototype.setStyle = function(attr, val) {
	this.node.style[attr] = val;
}


SingleElement.prototype.hide = function() {
	this.setStyle("display", "none");
}

SingleElement.prototype.show = function() {
	this.setStyle("display", "");
}

SingleElement.prototype.setColor = function(col) {
	this.setStyle("color", col);
}

SingleElement.prototype.setBackgroundColor = function(col) {
	this.setStyle("backgroundColor", col);
}

SingleElement.prototype.setContent = function(content) {
	this.node.innerHTML = content;
}



//
// END OF SingleElement
//


//
// SetOfElements
//
function SetOfElements(els)
{
	this.nodesObjects = [];
	for (var i=0; i < els.length; ++i) 
	{
		this.nodesObjects.push(new SingleElement(els[i]));
	}

	
	// this function must be separate, since it's a closure...
	function forallObjects(method)
	{
		return function ()
		{ 
			for (var j=0; j < this.nodesObjects.length; ++j)
			{
				var singleElementMethod = this.nodesObjects[j][method];
				
				singleElementMethod.apply(this.nodesObjects[j],
					this[method].arguments);
			}
			return this;
		}
	}
	
	// loop through all the methods of an element
	var publicMethods = this.nodesObjects[0].getPublicMethods();
	for (var i=0; i < publicMethods.length; ++i)
	{
		var method = publicMethods[i];
		SetOfElements.prototype[method] = forallObjects(method);
	}
	
	

}


//
// END OF SetOfElements
//