/**
 *@desc: 疫情风险等级爬虫
 *@author: XinD
 *@date: 2021/1/29
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const { post } = require('./utils/request');
const Reptile=()=>{
    puppeteer.launch({ args: ['--no-sandbox'] }).then(async browser => {
        const browserWSEndpoint = browser.wsEndpoint();
        const browser2 = await puppeteer.connect({browserWSEndpoint});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0)
        await page.setJavaScriptEnabled(true)
        page.on('response',(response)=>{
            if (response.url() === 'http://103.66.32.242:8005/zwfwMovePortal/interface/interfaceJson') {
                response.json().then(async res=>{
                    post('/api/addRisk',res).then(data=>{
                        console.log(`${data}___${new Date().toLocaleTimeString()}`)
                    }).catch(err=>{
                        console.log(err,'err')
                    })
                }).catch((err)=>{
                })
            }
        })
        await page.goto('http://bmfw.www.gov.cn/yqfxdjcx/risk.html');
        // 关闭 Chromium
        browser2.close();
    });
}
new CronJob('* 15 * * * *', function() {
    Reptile()
}, null, true, null);

