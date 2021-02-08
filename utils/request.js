const request = require('request')
let baseUrl = 'https://ncov.picchealth.com/ncov'
exports.post = async(url,data) => {
    return new Promise((resolve, reject) => {
        request.post({
            'url': baseUrl + url,
            'headers': {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }, (error, response)=>{
            if(error) reject(error)
            resolve(response ? response.body?response.body:response : '')
        });
    })
}

