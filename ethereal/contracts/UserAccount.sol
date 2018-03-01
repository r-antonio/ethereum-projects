pragma solidity ^0.4.11;

contract UserAccount {

	mapping (uint => Post) _posts;
	uint public _numberOfPosts;
	address public _adminAddress;
	uint constant MAX_DATA_SIZE = 160;
	uint constant MAX_POST_SIZE = 240;

	// data structure of a single post
	struct Post {
		uint timestamp;
		uint lastEdited;
		string message;
		uint dataType;
		string data;
	}

	modifier onlyAdmin {
		require(msg.sender == _adminAddress);
		_;
	}

	function UserAccount() public {
		_numberOfPosts = 0;
		_adminAddress = msg.sender;
	}

	function() public payable { } // for donations :D

	function post(string message, uint dataType, string data) onlyAdmin public {
		require(bytes(message).length <= MAX_POST_SIZE);
		require(bytes(data).length <= MAX_DATA_SIZE);
		_posts[_numberOfPosts].timestamp = now;
		_posts[_numberOfPosts].lastEdited = now;
		_posts[_numberOfPosts].message = message;
		_posts[_numberOfPosts].dataType = dataType;
		_posts[_numberOfPosts].data = data;
		_numberOfPosts++;
	}

  function editPost(uint postId, string data) onlyAdmin public {
		require(postId >= 0 && postId < _numberOfPosts);
		require(bytes(data).length <= MAX_DATA_SIZE);
		_posts[postId].data = data;
		_posts[postId].lastEdited = now;
	}

	function getPost(uint postId) constant public returns (string message, uint timestamp, uint dataType, string data, uint lastEdited) {
		require(postId > 0 && postId < _numberOfPosts);
		message = _posts[postId].message;
		timestamp = _posts[postId].timestamp;
		dataType = _posts[postId].dataType;
		data = _posts[postId].data;
		lastEdited = _posts[postId].lastEdited;
	}

	function getLastPost() constant public returns (string message, uint timestamp, uint dataType, string data, uint lastEdited, uint numberOfPosts) {
		message = _posts[_numberOfPosts - 1].message;
		timestamp = _posts[_numberOfPosts - 1].timestamp;
		dataType = _posts[_numberOfPosts - 1].dataType;
		data = _posts[_numberOfPosts - 1].data;
		lastEdited = _posts[_numberOfPosts - 1].lastEdited;
		numberOfPosts = _numberOfPosts;
	}

	function getOwnerAddress() constant public returns (address adminAddress) {
		return _adminAddress;
	}

	function getNumberOfPosts() constant public returns (uint numberOfPosts) {
		return _numberOfPosts;
	}

	function adminRetrieveDonations(address receiver) public onlyAdmin {
		receiver.transfer(this.balance);
	}

	function adminDeleteAccount() public onlyAdmin {
		selfdestruct(_adminAddress); // this is a predefined function, it deletes the contract and returns all funds to the owner's address
	}
}
