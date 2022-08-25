/*
 * @Author: jony 
 * @Date: 2022-03-25 10:08:57 
 * @Last Modified by: jony
 * @Last Modified time: 2022-03-25 14:24:30
 */

const models = require('../../models')
const tencentcloud = require("tencentcloud-sdk-nodejs")
const { setString, getString } = require('../../redis')
const Base64 = require('js-base64')
const moment = require('moment')
// 导入对应产品模块的client models。
const smsClient = tencentcloud.sms.v20210111.Client
//腾讯云短信配置文件,这些在腾讯云控制台都能看见
const config = {
    secretId: '',
    secretKey: '',
    SmsSdkAppId: "",
    SignName: "",
    TemplateId: "",
    Time: 5,
    timenow: moment().format('YYYYMMDD') + '00',
    timeend: moment().format('YYYYMMDD') + '23',
    time_now: moment().format("YYYY-MM-DD HH:mm:ss"),
    time_end: moment().format("YYYY-MM-DD") + ' 23:59:59'
}


class Code {
    //获取短信验证码接口/发送短信
    async getcode(req, res) {
        try {
            const phone = Base64.decode(req.body.phone)
            const code = Math.round(Math.random() * (899999) + 100000)
            const time_key = moment(moment().format("YYYY-MM-DD") + ' 23:59:59').diff(moment(moment().format("YYYY-MM-DD HH:mm:ss")), 'seconds')
            if (!phone || phone.length != 11 || !phone.match(/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g) || phone.match(/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g)[0].length != 11) {
                var data = {
                    code: 500,
                    msg: '请输入手机号'
                }
                res.json(data)
                return
            }
            const client = new smsClient({
                credential: {
                    secretId: config.secretId,
                    secretKey: config.secretKey,
                },
                /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
                region: "ap-guangzhou",
                /* 非必填:
                 * 客户端配置对象，可以指定超时时间等配置 */
                profile: {
                    /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
                    signMethod: "HmacSHA256",
                    httpProfile: {
                        /* SDK默认使用POST方法。
                         * 如果你一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
                        reqMethod: "POST",
                        /* SDK有默认的超时时间，非必要请不要进行调整
                         * 如有需要请在代码中查阅以获取最新的默认值 */
                        reqTimeout: 30,
                        /**
                         * 指定接入地域域名，默认就近地域接入域名为 sms.tencentcloudapi.com ，也支持指定地域域名访问，例如广州地域的域名为 sms.ap-guangzhou.tencentcloudapi.com
                         */
                        endpoint: "sms.tencentcloudapi.com"
                    },
                },
            })
            /* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
            * 属性可能是基本类型，也可能引用了另一个数据结构
            * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
            // const params2 = {
            //     // 短信应用ID: 短信SdkAppId在 [短信控制台] 添加应用后生成的实际SdkAppId，示例如1400006666
            //     SmsSdkAppId: config.SmsSdkAppId,
            //     // 拉取最大条数，最多100条
            //     Limit: 100,
            // }
            // // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            // client.PullSmsSendStatus(params2, function (err, response) {
            //     // 请求异常返回，打印异常信息
            //     if (err) {
            //         console.log(err)
            //         return
            //     }
            //     // 请求正常返回，打印response对象
            //     console.log(response)
            //     res.json(response)
            // })

            /* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
            * 属性可能是基本类型，也可能引用了另一个数据结构
            * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
            // const params1 = {
            //     // 短信应用ID: 短信SdkAppId在 [短信控制台] 添加应用后生成的实际SdkAppId，示例如1400006666
            //     SmsSdkAppId: config.SmsSdkAppId,
            //     // 拉取最大条数，最多100条
            //     Limit: 10,
            //     // 偏移量 注：目前固定设置为0
            //     Offset: 0,
            //     // 开始时间，yyyymmddhh 需要拉取的起始时间，精确到小时
            //     BeginTime: config.timenow,
            //     // 结束时间，yyyymmddhh 需要拉取的截止时间，精确到小时
            //     // 注：EndTime 必须大于 BeginTime
            //     EndTime: config.timeend,
            // }
            // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            // client.SendStatusStatistics(params1, function (err, response) {
            //     // 请求异常返回，打印异常信息
            //     if (err) {
            //         console.log(err)
            //         return
            //     }
            //     // 请求正常返回，打印response对象
            //     console.log(response)
            // })
            const params = {
                /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
                // 应用 ID 可前往 [短信控制台](https://console.cloud.tencent.com/smsv2/app-manage) 查看
                SmsSdkAppId: config.SmsSdkAppId,
                /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名 */
                // 签名信息可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-sign) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-sign) 的签名管理查看
                SignName: config.SignName,
                /* 模板 ID: 必须填写已审核通过的模板 ID */
                // 模板 ID 可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-template) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-template) 的正文模板管理查看
                TemplateId: config.TemplateId,
                /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
                TemplateParamSet: [code, config.Time],
                /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
                 * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
                PhoneNumberSet: ['+86' + phone],
                /* 用户的 session 内容（无需要可忽略）: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
                SessionContext: "",
                /* 短信码号扩展号（无需要可忽略）: 默认未开通，如需开通请联系 [腾讯云短信小助手] */
                ExtendCode: "",
                /* 国际/港澳台短信 senderid（无需要可忽略）: 国内短信填空，默认未开通，如需开通请联系 [腾讯云短信小助手] */
                SenderId: "",
            }
            //在redis中读取一下这个手机号是否发送过短信
            var getresult = JSON.parse(await getString(phone))
            const time_last = moment(moment().format("YYYY-MM-DD HH:mm:ss")).diff(moment(getresult.create_time), 'minutes')
            const again = 5 - moment(moment().format("YYYY-MM-DD HH:mm:ss")).diff(moment(getresult.create_time), 'minutes')
            if (time_last < 5) {
                var data = {
                    code: 500,
                    msg: '请过' + again + '分钟后再尝试'
                }
                res.json(data)
                return
            }
            if (!getresult || getresult.number > 5) {
                send_code(phone, code, getresult)
            } else {
                var data = {
                    code: 500,
                    msg: '此手机号今日获取验证码次数已达上线，请24小时后重试'
                }
                res.json(data)
            }
            // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            function send_code(phone, code, getresult) {
                client.SendSms(params, async function (err, response) {
                    // 请求异常返回，打印异常信息
                    // if (err) {
                    //     console.log(err)
                    //     return
                    // }
                    // 请求正常返回，打印response对象
                    if (response.SendStatusSet[0].Code == 'Ok') {
                        let number = 0
                        if (getresult) {
                            number = getresult.number + 1
                        } else {
                            number = 1
                        }
                        var code_data = {
                            code: code,
                            number: number,
                            create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                        }
                        //在redis中统计此用户的请求次数
                        var result = await setString(phone, JSON.stringify(code_data), time_key)
                        //在session中设置验证码code
                        if (req.session.code) {
                            delete req.session.code//销毁session让用户重新获取新的session
                            req.session.code = code // session 存储验证码数值
                        } else {
                            req.session.code = code // session 存储验证码数值
                        }
                        var data = {
                            code: 200,
                            msg: '发送成功'
                        }
                        res.json(data)
                    } else {
                        var data = {
                            code: 500,
                            msg: '发送失败，请稍后重试'
                        }
                        res.json(data)
                    }
                })
            }
        } catch (error) {
            var data = {
                code: 500,
                msg: '异常请求'
            }
            res.json(data)
        }
    }
}

module.exports = new Code()
