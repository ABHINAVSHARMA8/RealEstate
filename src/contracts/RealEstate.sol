/*
    1. Make properties as Erc20: new tokens fro each property
    2. Users can buy,sell,rent
    3. Owners will receive rent from tenants at month's end
*/

//1.Check array in prop_balance
//2. POst prpoerty on sale(post)
// 3 . take security deposit from tenant


pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RealEstate is ERC20{

    struct Property{

        uint id;
        address owner;
        uint price;
        bool onSale;

        

    }

    

    event PropertyCreated(

        uint id,
        address owner,
        uint price,
        uint balance,
        bool onSale
    );


    event BuyEvent(

        uint id,
        address from,
        address to,
        uint price
    );

    event RentEvent(

        uint id,
        address tenat,
        address owner,
        uint percent,
        uint time
    );

    event DeRentEvent(

        uint id,
        address tenant,
        address owner
    );

    event PayRentEvent(

        uint id,
        address tenant,
        address owner,
        uint rent
    );

    event ThrowTenantEvent(

        uint id,
        address tenant,
        address owner
    );

    event PostEvent(

        uint id,
        address owner
    );
    
    
    mapping(address=>uint[]) prop_balance;
    mapping(address=>uint[]) prop_time;
    mapping(uint=>Property) prop_list;

    modifier notOwner(uint id) {

        Property storage p = prop_list[id];

        require(msg.sender!=p.owner,'Owner cannot perform the operation');
        _;
    }

    constructor(uint properties)  ERC20("Property","PPT"){
        

        for(uint i=0;i<properties;i++){

            Property memory p = Property(i,msg.sender,(i+1),false);

            prop_list[i]=p;

            _mint(msg.sender,p.price*10**18);

            prop_balance[msg.sender][i]=p.price*10**18;


            emit PropertyCreated(p.id,p.owner,p.price,balanceOf(msg.sender),false);

        }
    }

    function get_property(uint id) public returns(uint){

        Property memory p = prop_list[id];

        emit PropertyCreated(id,p.owner,p.price, balanceOf(p.owner),false);

        return p.price;
    }

    function buy(uint id) public payable notOwner(id){

        Property storage p = prop_list[id];


        require(p.onSale==true,'Property not for sale');
        require(msg.value==p.price,'Incorrect amount of funds');

        address payable prev_owner = payable(p.owner);

        prev_owner.transfer(msg.value); //money sent

        uint balance = prop_balance[prev_owner][id];

        prop_balance[msg.sender][id]+=balance;

        prop_balance[prev_owner][id]=0;

        approve(prev_owner,balance);
        transferFrom(prev_owner, msg.sender,balance);

        p.onSale=false;

        emit BuyEvent(id,prev_owner,p.owner,p.price);


    }

    

    function rent(uint id,uint percent) public payable notOwner(id){

        Property storage  p = prop_list[id];

        
        require(percent!=100,'Call Buy');
        require(percent>0 && percent<=99,'Rent not in proper range');

        uint tokens = (percent/100) *p.price* 10**18;

        require(prop_balance[p.owner][id]>=tokens,'This amount of property cannot be rented');

        uint security  =  (percent/100)*p.price*10**18;
        security = (security)/60000;

        require(msg.value==security,'Insufficent security');

        approve(p.owner,tokens);
        transferFrom(p.owner,msg.sender,tokens);
        payable(p.owner).transfer(msg.value);

        prop_balance[p.owner][id]-=tokens;
        prop_balance[msg.sender][id]+=tokens;

        prop_time[msg.sender][id] = block.timestamp;

        emit RentEvent(id,msg.sender,p.owner,percent,block.timestamp);
    }

    function de_rent(uint id) public notOwner(id) {

        Property storage p = prop_list[id];

        require(prop_balance[msg.sender][id]>0,'You have not rented this property');

        uint balance = prop_balance[msg.sender][id];
        approve(msg.sender,balance);
        transferFrom(msg.sender,p.owner, balance);

        
        prop_balance[msg.sender][id]=0;
        prop_time[msg.sender][id]=0;
        prop_balance[p.owner][id]+=balance;

        emit DeRentEvent(id,msg.sender,p.owner);
    }

    function pay_rent(uint id) public payable notOwner(id){

        Property storage p = prop_list[id];

        require(prop_balance[msg.sender][id]>0,'Cannot pay rent for a property not rented');

        uint time_elapsed = (block.timestamp - prop_time[msg.sender][id])/60000;  //hour

        require(time_elapsed>=1,'Pay rent after an hour');

        uint rent = prop_balance[msg.sender][id]/(10**18);
        rent*=time_elapsed;

        require(rent>0,'Cannot pay 0 rent');


        require(msg.value==rent,'Incorrect amount of rent');

        payable(p.owner).transfer(msg.value);

        prop_time[msg.sender][id]=block.timestamp;

        emit PayRentEvent(id,msg.sender,p.owner,msg.value);

    }

    function throw_faulty_tenant(uint id,address tenant)  public {

        Property storage p = prop_list[id];

        require(p.owner==msg.sender,'Only owner can throw out a tenant');
        uint time_elapsed = (block.timestamp - prop_time[tenant][id])/6000;  //hour

        require(time_elapsed>=1,'Tenant is not faulty');

        require(prop_balance[tenant][id]>0,'This address has not rented the property');

        uint balance = prop_balance[tenant][id];
        approve(tenant,balance);
        transferFrom(tenant,p.owner,balance);

        prop_balance[tenant][id]=0;
        prop_balance[p.owner][id]+=balance;
        
        emit ThrowTenantEvent(id,tenant,msg.sender);

        

        

       
    }  

    function postProperty(uint id) public {

        Property storage p = prop_list[id];
        require(p.owner==msg.sender,'Only owner can put property on sale');
        require(p.onSale==false,'Property already on sale');

        p.onSale=true;

        emit PostEvent(id,p.owner);
    }
}