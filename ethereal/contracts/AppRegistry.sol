pragma solidity ^0.4.11;

contract AppRegistry {

	// mappings to look up account names, account ids and addresses
	mapping (address => string) _accountAddressToAccountName;
	mapping (uint => address) _accountIdToAccountAddress;
	mapping (string => address) _accountNameToAccountAddress;
	mapping (address => address) _addressToAccountAddress;
	mapping (string => address) _accountNameToAddress;

	uint public _numberOfAccounts;
	address public _registryAdmin;
	address public _accountAdmin;
	// if a newer version of this registry is available, force users to use it
	bool public _registrationDisabled;

	uint constant MAX_NAME_SIZE = 64;

	modifier onlyRegistryAdmin {
		require(msg.sender == _registryAdmin);
		_;
	}

	modifier onlyAdmin {
		require(msg.sender == _registryAdmin || msg.sender == _accountAdmin);
		_;
	}

	function AppRegistry() public {
		_registryAdmin = msg.sender;
		_accountAdmin = msg.sender; // can be changed later
		_numberOfAccounts = 0;
		_registrationDisabled = false;
	}

	function() public payable { } // for donations :D

	function register(string name, address accountAddress) public {
		require(_accountNameToAccountAddress[name] == address(0)); // name not registered
		require(bytes(_accountAddressToAccountName[accountAddress]).length == 0); // account address not registered
		require(_addressToAccountAddress[msg.sender] == address(0)); // user address not registered
		require(bytes(name).length <= MAX_NAME_SIZE);
		assert(!_registrationDisabled);
		_accountAddressToAccountName[accountAddress] = name;
		_addressToAccountAddress[msg.sender] = accountAddress;
		_accountNameToAccountAddress[name] = accountAddress;
		_accountNameToAddress[name] = msg.sender;
		_accountIdToAccountAddress[_numberOfAccounts] = accountAddress;
		_numberOfAccounts++;
	}

	function getNumberOfAccounts() constant public returns (uint numberOfAccounts) {
		return _numberOfAccounts;
	}

	function getAccountAddressOfName(string name) constant public returns (address addr) {
		return _accountNameToAccountAddress[name];
	}

	function getNameOfAccountAddress(address addr) constant public returns (string name) {
		return _accountAddressToAccountName[addr];
	}

	function getAccountAddressOfId(uint id) constant public returns (address addr) {
		return _accountIdToAccountAddress[id];
	}

	function unregister() public returns (string unregisteredAccountName) {
		require(_addressToAccountAddress[msg.sender] != 0);
		_addressToAccountAddress[msg.sender] = address(0);
		unregisteredAccountName = _accountAddressToAccountName[msg.sender];
		_accountAddressToAccountName[msg.sender] = "";
		_accountNameToAccountAddress[unregisteredAccountName] = address(0);
		_accountNameToAddress[unregisteredAccountName] = address(0);
	}

	function adminUnregister(string name) public onlyAdmin{
		address addr = _accountNameToAccountAddress[name];
		_accountAddressToAccountName[addr] = "";
		_accountNameToAccountAddress[name] = address(0);
		address userAdress = _accountNameToAddress[name];
		_accountNameToAddress[name] = address(0);
		_addressToAccountAddress[userAdress] = address(0);
	}

	function adminSetRegistrationDisabled(bool registrationDisabled) public onlyRegistryAdmin {
		// currently, the code of the registry can not be updated once it is
		// deployed. if a newer version of the registry is available, account
		// registration can be disabled
		_registrationDisabled = registrationDisabled;
	}

	function adminSetAccountAdministrator(address accountAdmin) public onlyRegistryAdmin {
		_accountAdmin = accountAdmin;
	}

	function adminRetrieveDonations() public onlyRegistryAdmin {
		_registryAdmin.transfer(this.balance);
	}

	function adminDeleteRegistry() public onlyRegistryAdmin {
		selfdestruct(_registryAdmin); // this is a predefined function, it deletes the contract and returns all funds to the admin's address
	}
}
