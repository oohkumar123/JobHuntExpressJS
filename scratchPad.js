let obj1 = {
    itemOne: 'one',
    itemTwo: 'two',
    itemThree: 'three',
    itemFour: 'four',
    itemFive: 'five',
}
let obj2 = {_id:null}
const new_obj = {_id:null, ...obj1}
new_obj