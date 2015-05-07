
/** Get the UI state of the card based on vote.
    Vote has 3 states:
    null - user didn't vote
    true - user voted, but the vote is hidden
    a number - the value of his/her vote*/
function getCardState(vote) {
	if (vote === null) {
		return "hidden"
	}

	if (vote !== true) {
		return "turned"
	}

	return "";
}

function User(userInfo) {
	this.id = userInfo.id;
	this.name = userInfo.name;
	this.dom = null;
	this.vote = null;
	this.isCurrentPlayer = false;
}

User.prototype = {
	getDOM: function () {
		if (!this.dom) {
			this.dom = $(nj.render("player.html", {
				name: this.name,
				state: getCardState(this.vote)
			}));

			if (this.isCurrentPlayer) {
				this.dom.attr("id", "currentPlayer");
			}
		}
		return this.dom;
	},

	castVote: function () {
		var value = $(this).data("value");
		socket.emit("vote", {voteValue: value});
	}
}
