module.exports=function Cart(oldCart){
    //items contains the object of items with key as their productId and value is and object that contains item price qty
    this.items=oldCart.items||{};
    this.totalQty=oldCart.totalQty|| 0;
    this.totalPrice=oldCart.totalPrice||0;

    this.add=function(item,id){
        let storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item:item, qty:0, price:0}
        }
        storedItem.qty++;
        storedItem.price=storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice+=storedItem.item.price;
    }

    this.generateArray=function(){
        let arr=[];
        for(let id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
    //qty price item

    this.reduceByOne=function(id){
        this.items[id].qty--;
        this.items[id].price-=this.items[id].item.price;
        this.totalQty--;
        this.totalPrice-=this.items[id].item.price;

        if(this.items[id].qty<=0){
            delete this.items[id];
        }
    }

    this.increaseByOne=function(id){
        this.items[id].qty++;
        this.items[id].price+=this.items[id].item.price;
        this.totalQty++;
        this.totalPrice+=this.items[id].item.price;
    }
}