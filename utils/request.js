const request = require('request')
let baseUrl = ''
if(process.env.NODE_ENV='production'){
    baseUrl = 'https://apptest.picchealth.com/ncov'
}else{
    baseUrl = 'https://apptest.picchealth.com/ncov'
}
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
            resolve(response.body?response.body:response)
        });
    })
}

