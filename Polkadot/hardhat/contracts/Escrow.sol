//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Escrow {
    enum STATE {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY
    }

    enum ROLES {
        BUYER,
        SELLER
    }

    STATE public state;
    address immutable public escrow;
    address payable public buyer;
    address payable public seller;

    modifier expectedState(STATE _expected_state) {
        require(state == _expected_state, "Unexpected state");
        _;
    }

    modifier onlyRole(address _role) {
        require(msg.sender == _role, "Unexpected calling address");
        _;
    }

    constructor() {
        escrow = msg.sender;
    }

    function makePayment(address payable _seller) public payable expectedState(STATE.AWAITING_PAYMENT) {
        require(msg.value > 0, "Payment must be greater than 0");

        state = STATE.AWAITING_DELIVERY;
        buyer = payable(msg.sender);
        seller = _seller;
    }

    function confirmDelivery() public expectedState(STATE.AWAITING_DELIVERY) onlyRole(buyer) {
        seller.transfer(address(this).balance);
        state = STATE.AWAITING_PAYMENT;
        buyer = payable(0);
        seller = payable(0);
    }

    function refundPayment() public expectedState(STATE.AWAITING_DELIVERY) onlyRole(seller) {
        buyer.transfer(address(this).balance);
        state = STATE.AWAITING_PAYMENT;
        buyer = payable(0);
        seller = payable(0);
    }

    function intermediate(ROLES _receiver) public expectedState(STATE.AWAITING_DELIVERY) onlyRole(escrow) {
        if(_receiver == ROLES.BUYER) {
            buyer.transfer(address(this).balance);
        } else {
            seller.transfer(address(this).balance);
        }
        
        state = STATE.AWAITING_PAYMENT;
        buyer = payable(0);
        seller = payable(0);
    }
}
