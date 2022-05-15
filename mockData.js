export const request_proxy_config = {
    "enabled": true,
    "list": [
        {
            "cover": false,
            "enabled": true,
            "match": "Normal",
            "name": "test1",
            "request": {
                "body": "{\"offset\":10}",
                "headers": "{\"test\": \"test\"}",
                "query": "{\"latitude\":120.0145264,\"longitude\":30.2831792,\"queryContext\":\"肯德基\"}"
            },
            "response": "{\"code\":0,\"data\":{\"total\":12,\"list\":[{\"id\":1055,\"name\":\"1全家便利店111\",\"address\":\"浙江省杭州市余杭区-海创园14幢\",\"contactName\":\"沧尽\",\"contactMobile\":\"13313131313\",\"typeId\":261,\"typeName\":\"超市/便利店\",\"gmtCreate\":1652169465730,\"examineStatus\":3,\"examineRejectReason\":\"代理商、运营型服务商的门店不能创建商机,shopId=1112119164\",\"examineRemark\":\"代理商、运营型服务商的门店不能创建商机,shopId=1112119164\",\"shopCreateSourceEnum\":\"CREATE_OPPO\",\"defaultTip\":\"审核中,请等待审核通过后再开始签约及安装\",\"mobile\":\"13313131313\",\"creator\":617,\"examineTime\":1652169490440,\"parentTypeName\":\"购物\",\"importSubject\":1,\"subjectBizId\":0},{\"id\":1054,\"name\":\"全家便利店九\",\"address\":\"浙江省杭州市余杭区-未来科技城海创园5号楼一楼\",\"contactName\":\"沧尽\",\"contactMobile\":\"13333333333\",\"typeId\":98,\"typeName\":\"美容/美发\",\"gmtCreate\":1652082205742,\"examineStatus\":3,\"examineRejectReason\":\"代理商、运营型服务商的门店不能创建商机,shopId=1112119115\",\"examineRemark\":\"代理商、运营型服务商的门店不能创建商机,shopId=1112119115\",\"shopCreateSourceEnum\":\"CREATE_OPPO\",\"defaultTip\":\"审核中,请等待审核通过后再开始签约及安装\",\"mobile\":\"13333333333\",\"creator\":617,\"examineTime\":1652082615856,\"parentTypeName\":\"休闲娱乐\",\"importSubject\":1,\"subjectBizId\":0}]},\"msg\":\"ok\",\"success\":true}",
            "rule": "/budd/shop/draft/examine/list"
        },
        {
            "cover": false,
            "enabled": true,
            "match": "Normal",
            "name": "test2",
            "request": {
                "body": "{}",
                "headers": "{}",
                "query": "{}"
            },
            "response": `{
                "code": 0,
                "data": [
                    {
                        "id": 138705,
                        "aid": "594734922200989697",
                        "aidint": 594734922200989700,
                        "type": 1,
                        "views": 127,
                        "uuid": "72ed533cba91d65ab4e54f737",
                        "status": 1,
                        "publish_time": 1641257549068,
                        "ctime": 1641257549162,
                        "utime": 1652597357178,
                        "vid": "",
                        "source": 2,
                        "sub_status": 0,
                        "score": 1652597313000,
                        "article_title": "ReactNative进阶（一）：ReactNative 学习资料汇总",
                        "article_sharetitle": "ReactNative进阶（一）：ReactNative 学习资料汇总",
                        "article_subtitle": "",
                        "article_summary": "目前主流的移动跨平台技术方案大体可以分为三类，",
                        "article_cover": "https://static001.geekbang.org/infoq/a3/a39cd56faf1070b08744264495c4e789.jpeg",
                        "article_cover_point": "",
                        "author": [
                            {
                                "uid": 2692866,
                                "nickname": "No Silver Bullet",
                                "avatar": "https://static001.geekbang.org/account/avatar/00/29/17/02/c789d744.jpg",
                                "active": 1,
                                "is_early": 0,
                                "ucode": "3740FBFA35E5F3",
                                "uri": "/u/shq5785/",
                                "author_type": 1,
                                "vip": 0
                            }
                        ],
                        "translator": null,
                        "planner": null,
                        "topic": [
                            {
                                "id": 1,
                                "name": "语言 & 开发",
                                "alias": "development"
                            },
                            {
                                "id": 3,
                                "name": "文化 & 方法",
                                "alias": "culture-methods"
                            },
                            {
                                "id": 107,
                                "name": "其他",
                                "alias": "others"
                            }
                        ],
                        "is_collect": false,
                        "no_author": "",
                        "is_promotion": false,
                        "share_pic": "",
                        "sub_type": 0,
                        "comment_user": 0,
                        "comment_count": 0,
                        "speaker_title": "",
                        "speaker_introduce": "",
                        "video_status": 0,
                        "duration": "",
                        "total_duration": "",
                        "label": [
                            {
                                "id": 4505,
                                "name": "React Native"
                            },
                            {
                                "id": 17234,
                                "name": "1月月更"
                            }
                        ],
                        "out_id": null,
                        "word_count": 4055,
                        "front_type": 1,
                        "content_short": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://static001.geekbang.org/infoq/0b/0b2b9bdfc9668e4c579a95dfcd9bb588.png\",\"alt\":null,\"title\":null,\"style\":[{\"key\":\"width\",\"value\":\"75%\"},{\"key\":\"bordertype\",\"value\":\"none\"}],\"href\":null,\"fromPaste\":true,\"pastePass\":true}},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"一、序\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"目前主流的移动跨平台技术方案大体可以分为三类，\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"numberedlist\",\"attrs\":{\"start\":1,\"normalizeStart\":1},\"content\":[{\"type\":\"listitem\",\"attrs\":{\"listStyle\":null},\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":1,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"使用\",\"attrs\":{}},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\",\"attrs\":{}}],\"text\":\"原生内置浏览器\",\"attrs\":{}},{\"type\":\"text\",\"text\":\"加载\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"HTML5\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"的\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Hybrid\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"技术方案，采用此种方案的主要有\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Cordova\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"、\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Ionic\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"和\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"微信小程序\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"；\",\"attrs\":{}}]}]},{\"type\":\"listitem\",\"attrs\":{\"listStyle\":null},\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":2,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"使用\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JavaScript\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"语言进行开发，然后使用\",\"attrs\":{}},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\",\"attrs\":{}}],\"text\":\"原生组件\",\"attrs\":{}},{\"type\":\"text\",\"text\":\"进行渲染，采用此方案的主要有\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"React Native\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"、\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Weex\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"和\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"轻快应用\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"；\",\"attrs\":{}}]}]},{\"type\":\"listitem\",\"attrs\":{\"listStyle\":null},\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":3,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"使用\",\"attrs\":{}},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\",\"attrs\":{}}],\"text\":\"自带的渲染引擎\",\"attrs\":{}},{\"type\":\"text\",\"text\":\"和\",\"attrs\":{}},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\",\"attrs\":{}}],\"text\":\"自带的原生组件\",\"attrs\":{}},{\"type\":\"text\",\"text\":\"来实现跨平台，采用此种方案的主要是\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Flutter\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"。\",\"attrs\":{}}]}]}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"blockquote\",\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"对于其他的浏览器方案，基本可以抛弃了，相比较\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"React Native\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"和\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Flutter\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"，\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"React Native\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"和\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Flutter\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"在应用开发上，效率差不多，不过要强调性能的话，还是\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Flutter\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"为最佳选择。\",\"attrs\":{}}]}],\"attrs\":{}},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"二、前言\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"在\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Vue\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"开发一段时间后，发觉自己遇到了瓶颈期。需要学习新技能激活自己，选择\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"ReactNative\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"开发移动端。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"首先在环境搭建方面，自己时花费了2天的时间才将开发环境搭建好，有点费事费力，\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"设备选择：\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://static001.geekbang.org/infoq/b4/b405eec53c36759077b208dba20d8500.png\",\"alt\":null,\"title\":null,\"style\":[{\"key\":\"width\",\"value\":\"75%\"},{\"key\":\"bordertype\",\"value\":\"none\"}],\"href\":null,\"fromPaste\":true,\"pastePass\":true}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"环境搭建过程中，居然还区分芯片，也是醉了。\",\"attrs\":{}}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"三、常见问题\",\"attrs\":{}}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":3},\"content\":[{\"type\":\"text\",\"text\":\"3.1【MAC】打不开“XXXX Installer”，因为它来自身份不明的开发者。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"MAC\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"经常会安装一些非\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"AppStore\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"的软件会报安全提示，由于苹果系统安全策略问题。隔空传送接收的文件也会遇到上面的问题。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"打不开“XXXX Installer”，因为它来自身份不明的开发者。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://static001.geekbang.org/infoq/20/20dd1f549f2d80c1f18fb7cd7cd9c28d.png\",\"alt\":null,\"title\":null,\"style\":[{\"key\":\"width\",\"value\":\"75%\"},{\"key\":\"bordertype\",\"value\":\"none\"}],\"href\":null,\"fromPaste\":true,\"pastePass\":true}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"此时查看一下设置\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://static001.geekbang.org/infoq/49/49f3b217e9d5f61ecdbdce6f57692407.png\",\"alt\":null,\"title\":null,\"style\":[{\"key\":\"width\",\"value\":\"75%\"},{\"key\":\"bordertype\",\"value\":\"none\"}],\"href\":null,\"fromPaste\":true,\"pastePass\":true}},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":3},\"content\":[{\"type\":\"text\",\"text\":\"3.2 mac 安装homebrew出错 Failed to connect to raw.githubusercontent.com port 443: Connection refused error\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"应用如下命令安装\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"homebrew\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"时，\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"codeblock\",\"attrs\":{\"lang\":\"text\"},\"content\":[{\"type\":\"text\",\"text\":\"/usr/bin/ruby -e \\\"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\\\"\\n\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"开始一直报错\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"Failed to connect to raw.githubusercontent.com port 443: Connection refused error: Error: 7，\",\"attrs\":{}}],\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"原因：由于某些你懂的因素，导致\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"GitHub\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"的\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"raw.githubusercontent.com\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"域名解析被污染了。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"解决办法：通过查询查询真实IP，然后修改\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"hosts\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"解决此问题。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"在\",\"attrs\":{}},{\"type\":\"link\",\"attrs\":{\"href\":\"https://www.ipaddress.com/\",\"title\":\"\",\"type\":null},\"content\":[{\"type\":\"text\",\"text\":\"https://www.ipaddress.com/\",\"attrs\":{}}]},{\"type\":\"text\",\"text\":\"查询\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"raw.githubusercontent.com\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"的真实IP。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https://static001.geekbang.org/infoq/37/3775c5fdbd5d6412fb4ceb94aae25e8c.png\",\"alt\":null,\"title\":null,\"style\":[{\"key\":\"width\",\"value\":\"75%\"},{\"key\":\"bordertype\",\"value\":\"none\"}],\"href\":null,\"fromPaste\":true,\"pastePass\":true}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"可知，该域名对应实际IP为4个，选择其中一个IP进行\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"hosts\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"文件配置即可。\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"修改hosts\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"codeblock\",\"attrs\":{\"lang\":\"java\"},\"content\":[{\"type\":\"text\",\"text\":\"sudo vim /etc/hosts\\n\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"添加如下内容：\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"codeblock\",\"attrs\":{\"lang\":\"java\"},\"content\":[{\"type\":\"text\",\"text\":\"185.199.111.133 raw.githubusercontent.com\\n\",\"attrs\":{}}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":3},\"content\":[{\"type\":\"text\",\"text\":\"3.3 Could not find tools.jar. Please check that /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home contains a valid JDK installation.\",\"attrs\":{}}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"3.3.1 解决方法一：\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"在\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"~/.zshrc\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\" (或 \",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"~/.bashrc\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\" )文件中加入一句\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"codeblock\",\"attrs\":{\"lang\":\"text\"},\"content\":[{\"type\":\"text\",\"text\":\"export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_91.jdk/Contents/Home\\n\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"注：根据自己的实际\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JDK\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"路径修改上面的\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JDK\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"路径。查看\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JDK\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"位置的命令 \",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"/usr/libexec/java_home -V\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"（在MacOS11.1，执行这个命令可能看到两个路径，一个是JDK的实际路径，另一个是：\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"(这个是\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JRE\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"路径）。\",\"attrs\":{}}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"3.3.2 解决方法二：\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"下载最新版的\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JDK\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"并安装：\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"link\",\"attrs\":{\"href\":\"https://download.csdn.net/download/sunhuaqiang1/16808745\",\"title\":\"\",\"type\":null},\"content\":[{\"type\":\"text\",\"text\":\"点击下载\",\"attrs\":{}}]}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"解决方法三：手动复制 \",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"tools.jar\",\"attrs\":{}}],\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"执行如下操作：\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"codeblock\",\"attrs\":{\"lang\":\"text\"},\"content\":[{\"type\":\"text\",\"text\":\"sudo cp /Library/Java/JavaVirtualMachines/jdk1.8.0_211.jdk/Contents/Home/lib/tools.jar /Library/Internet\\\\ Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/lib\\n\",\"attrs\":{}}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"注：根据自己的实际JDK路径修改上面的\",\"attrs\":{}},{\"type\":\"codeinline\",\"content\":[{\"type\":\"text\",\"text\":\"JDK\",\"attrs\":{}}],\"attrs\":{}},{\"type\":\"text\",\"text\":\"路径\",\"attrs\":{}}]},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":3},\"content\":[{\"type\":\"text\",\"text\":\"3.4 查看环境变量配置\",\"attrs\":{}}]}]}",
                        "is_fill_info": 0
                    }
                ],
                "error": {},
                "extra": {
                    "cost": 0.043456792,
                    "request-id": "74e66795efae9b176fb215dd87dba4c6@2@infoq"
                }
            }`,
            "rule": "/public/v1/my/recommond"
        },
        {
            "cover": false,
            "enabled": false,
            "match": "Normal",
            "name": "test3",
            "request": {
                "body": "{}",
                "headers": "{}",
                "query": "{}"
            },
            "response": "{}",
            "rule": "/test"
        },
        {
            "cover": false,
            "enabled": true,
            "match": "RegExp",
            "name": "test4",
            "request": {
                "body": "{}",
                "headers": "{}",
                "query": "{}"
            },
            "response": "{}",
            "rule": "/test"
        },
        {
            "cover": false,
            "enabled": false,
            "match": "Normal",
            "name": "test5",
            "request": {
                "body": "{}",
                "headers": "{}",
                "query": "{}"
            },
            "response": "{}",
            "rule": "/test"
        },
        {
            "cover": false,
            "enabled": true,
            "match": "Normal",
            "name": "test6-contentjs",
            "request": {
                "body": "{}",
                "headers": "{}",
                "query": "{}"
            },
            "response": "{\n  \"err_no\": 0,\n  \"err_msg\": \"success\",\n  \"data\": [\n    {\n      \"item_type\": 14,\n      \"item_info\": {\n        \"id\": 2147,\n        \"advert_id\": \"7096807386010091533\",\n        \"user_id\": \"53218623894222\",\n        \"item_id\": \"0\",\n        \"item_type\": 14,\n        \"platform\": 2608,\n        \"layout\": 1,\n        \"position\": 1,\n        \"advert_type\": 1,\n        \"station_type\": 0,\n        \"author_name\": \"掘金一周\",\n        \"author_id\": 53218623894222,\n        \"title\": \"如何拥有 Star 700+的开源项目、 React18 新特性解读｜掘金一周 2022.05.11\",\n        \"brief\": \"【掘金一周 05.11】本期看点：如何有了星星700+的开源项目、 React18 新特性解读、打造 Go 语言最快的排序算法...\",\n        \"url\": \"https://juejin.cn/post/7096358153381478437?utm_source=feed1&utm_medium=web_feed&utm_campaign=juejin1week_0511\",\n        \"picture\": \"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ff7a2ff2b51497c9973c42a708afc8b~tplv-k3u1fbpfcp-watermark.image?\",\n        \"avatar\": \"https://p9-passport.byteacctimg.com/img/user-avatar/0779dd287afeb3e6a983deb0ff79d724~300x300.image\",\n        \"start_time\": \"0\",\n        \"end_time\": \"0\",\n        \"ctime\": \"1652360470\",\n        \"mtime\": \"1652360470\",\n        \"sale_count\": 0,\n        \"sale_price\": 0,\n        \"discount_rate\": 0,\n        \"digg_count\": 0,\n        \"comment_count\": 0,\n        \"topic\": \"\",\n        \"topic_id\": \"0\",\n        \"status\": 1,\n        \"item_user_info\": {\n          \"user_id\": \"53218623894222\",\n          \"user_name\": \"掘金一周\",\n          \"company\": \"\",\n          \"job_title\": \"\",\n          \"avatar_large\": \"https://p9-passport.byteacctimg.com/img/user-avatar/0779dd287afeb3e6a983deb0ff79d724~300x300.image\",\n          \"level\": 3,\n          \"description\": \"每周掘金优质文章\",\n          \"followee_count\": 0,\n          \"follower_count\": 1395,\n          \"post_article_count\": 22,\n          \"digg_article_count\": 126,\n          \"got_digg_count\": 806,\n          \"got_view_count\": 99660,\n          \"post_shortmsg_count\": 12,\n          \"digg_shortmsg_count\": 13,\n          \"isfollowed\": false,\n          \"favorable_author\": 0,\n          \"power\": 1802,\n          \"study_point\": 0,\n          \"university\": {\n            \"university_id\": \"0\",\n            \"name\": \"\",\n            \"logo\": \"\"\n          },\n          \"major\": {\n            \"major_id\": \"0\",\n            \"parent_id\": \"0\",\n            \"name\": \"\"\n          },\n          \"student_status\": 0,\n          \"select_event_count\": 0,\n          \"select_online_course_count\": 0,\n          \"identity\": 0,\n          \"is_select_annual\": false,\n          \"select_annual_rank\": 0,\n          \"annual_list_type\": 0,\n          \"extraMap\": {},\n          \"is_logout\": 0,\n          \"annual_info\": []\n        }\n      }\n    }\n  ],\n  \"cursor\": \"1\",\n  \"count\": 1000,\n  \"has_more\": true\n}",
            "rule": "/article/recommend_all_feed"
        }
    ]
}