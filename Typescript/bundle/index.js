"use strict";
//dengan typescript membantu pengenelan variable lebih mudah dengan menambahkan tipe data variable itu sendiri
let namaSaya = "Yansen Victor";
let userName = 123;
let isMarried = true;
let manySibling;
//pada variable dibawah, bermaksud untuk membuat 1 variable dengan lebih dari 1 tipe data (bisa semua tipe data kecuali array dan object)
let manySibling1;
let testVariable;
//deklarasi array
let siblingName;
//deklarasi tuple
let siblingName1;
let teman;
let teman1;
manySibling = 3;
manySibling1 = "tiga bro";
testVariable = "nyoba string";
testVariable = 2;
testVariable = true;
siblingName = ["Yuni", "Otto", "Iren"];
siblingName1 = ["Yuni", 2];
teman = {
    nama: "Bambang",
    isKampret: true,
    hutang: 45000,
};
teman1 = {
    nama: "Bambang",
    isKampret: true,
};
console.log({ namaSaya });
console.log({ userName });
console.log({ isMarried });
console.log({ manySibling });
console.log({ manySibling1 });
console.log({ testVariable });
console.log({ siblingName });
console.log({ siblingName1 });
console.log({ teman });
console.log({ teman1 });
//FUNCTION
// function di typescript memiliki tipe data juga, untuk contoh dibawah bertipe string karena return yang diberikan bentuk string
//ketika return kosong akan membuat function bertipe void
function create() {
    return "Terima kasih telah diisi";
}
//function bertipe data string dengna deklarasi langsung
function create1() {
    return "Terima kasih telah diisi string";
}
//menggunakan arrow function
const create2 = () => 2;
//funciton dengan tipe data void, adalah tipe data yang tidak mengembalikan nilai
function create3() {
    console.log("ini tipe void");
}
//function dengan parameter
function add(x, y) {
    const z = x + y;
    console.log("hasil sum adalah : " + z);
}
//function dengan parameter hasil akhir string
function add1(x, y) {
    return `${x} ditambah ${y} hasilnya adalah ${x + y}`;
}
console.log(create());
console.log(create1());
console.log(create2());
create3();
add(10, 20);
console.log(add1(20, 40));
function createIntel(processor) {
    console.log(`
    ---
    Terima kasih ${processor.brand}
    ---
    anda telah membuat processor baru dengan detail berikut :
    nama base model : ${processor.baseModel}
    nama model : ${processor.modelName}
    Total Core : ${processor.coreTotal}
    Kecepatan Clock : ${processor.clockSpeed}
    apakah turbo boost tersedia : ${processor.turboBoost} 
    `);
}
function createAMD(processor) {
    console.log(`
    ---
    Terima kasih ${processor.brand}
    ---
    anda telah membuat processor baru dengan detail berikut :
    nama base model : ${processor.baseModel}
    nama model : ${processor.modelName}
    Total Core : ${processor.coreTotal}
    Kecepatan Clock : ${processor.clockSpeed}
    apakah turbo boost tersedia : ${processor.precisionBoost} 
    `);
}
const coreI5 = {
    brand: "Intel",
    baseModel: "core I5",
    modelName: "I5-1135U",
    coreTotal: 2,
    clockSpeed: 4,
    turboBoost: true,
};
const ryzen3 = {
    brand: "AMD",
    baseModel: "Ryzen 3",
    modelName: "r-3550x",
    coreTotal: "dual core",
    clockSpeed: 4,
    precisionBoost: true,
};
createIntel(coreI5);
createAMD(ryzen3);
