let data = [{

    "id": 1,

    "model": "m3",

    "price": 10000000,

    "power": 500,

    "description": null,

    "brandName": "BMW"

}, {

    "id": 2,

    "model": "m2 competition",

    "price": 100000000,

    "power": 1000,

    "description": null,

    "brandName": "BMW"

}]

for (let key in data) {
        let row = document.createElement('tr')
        row.innerHTML = `<td class="login">${data[key].id}</td>
                      <td class="login">${data[key].model}</td>
                      <td class="login">${data[key].price}</td>
                      <td class="login">${data[key].power}</td>
                      <td class="login">${data[key].description}</td>
                      <td class="login">${data[key].brandName}</td>
                     `
        document.querySelector('.car').appendChild(row)
    }