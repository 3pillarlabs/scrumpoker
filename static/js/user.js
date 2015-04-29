function User(userInfo) {
	this.id = userInfo.id;
	this.name = userInfo.name;
	this.dom = null;
}

User.prototype = {
	getDOM: function () {
		this.dom = this.dom || $(nj.render("player.html", this));	
		return this.dom;
	}
}
