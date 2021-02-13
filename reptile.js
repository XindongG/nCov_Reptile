/**
 *@desc: 疫情风险等级爬虫
 *@author: XinD
 *@date: 2021/1/29
 */
const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const { post } = require('./utils/request');
const browserFetcher = puppeteer.createBrowserFetcher();
    let nowTime = new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
    browserFetcher.download("818858").then((res) => {
        const Reptile=()=>{
            puppeteer.launch({ args: ['--no-sandbox'] }).then(async browser => {
                const browserWSEndpoint = browser.wsEndpoint();
                const browser2 = await puppeteer.connect({browserWSEndpoint});
                const page = await browser2.newPage();
                await page.setDefaultNavigationTimeout(0)
                await page.setJavaScriptEnabled(true)
                page.on('response',(response)=>{
                    if (response.url() === 'http://103.66.32.242:8005/zwfwMovePortal/interface/interfaceJson' && response.request()._method !== 'OPTIONS') {
                        response.json().then(async res=>{
                            post('/api/addRisk',res).then(async data=>{
                                console.error(`${data}___${nowTime}___数据入库成功`)
                                // 关闭页面并断开连接
                                await page.close()
                                await browser2.close();
                            }).catch(async err=>{
                                console.log(`${err}___${nowTime}___数据入库失败`)
                                // 关闭页面并断开连接
                                await page.close()
                                await browser2.close();
                            })
                        }).catch(async (err)=>{
                            console.log(`${err}___${nowTime}___解析页面接口报错`)
                            // 关闭页面并断开连接
                            await page.close()
                            await browser2.close();
                        })
                    }
                })
                if(page.target().url() === 'http://bmfw.www.gov.cn/yqfxdjcx/risk.html' && !page.isClosed()){
                    await page.reload().then(res=>{
                        console.log(`reloadPageSuccess___http://bmfw.www.gov.cn/yqfxdjcx/risk.html___${nowTime}`)
                    }).catch(err=>{
                        console.log(`reloadPageError___${err}___http://bmfw.www.gov.cn/yqfxdjcx/risk.html___${nowTime}`)
                    });
                }else{
                    await page.goto('http://bmfw.www.gov.cn/yqfxdjcx/risk.html').then(res=>{
                        console.log(`openPageSuccess___http://bmfw.www.gov.cn/yqfxdjcx/risk.html___${nowTime}`)
                    }).catch(err=>{
                        console.log(`openPageError___${err}___http://bmfw.www.gov.cn/yqfxdjcx/risk.html___${nowTime}`)
                    });
                }
            });
        }
        Reptile()
        new CronJob('0 0 0/1 * * *', function() {
            Reptile()
        }, null, true, null);
})



