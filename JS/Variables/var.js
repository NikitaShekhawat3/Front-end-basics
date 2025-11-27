let WelcomeMsg = 'hello world!';
console.log(WelcomeMsg);
const nName = 'Nikita Shekhawat';
console.log(nName);
document.querySelector('#myname').innerText = nName ;
let shoes = 23999 - (10/100)*23999 ;
let thebag = 38999 - (29/100)*38999 ;
const gst = (18/100);
let TotalPrice = (shoes + thebag + 20 + 25)*(1+gst);
console.log(`Total price of the products in your cart is ${TotalPrice}`);
console.log(eval('22+64*5/9-10+56'))