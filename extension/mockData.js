const mockData = [
    {
        rule: '/article/recommend_all_feed',
        response: `{
            "err_no": 0,
            "err_msg": "success",
            "data": [
                {
                    "item_type": 14,
                    "item_info": {
                        "id": 2147,
                        "advert_id": "7096807386010091533",
                        "user_id": "53218623894222",
                        "item_id": "0",
                        "item_type": 14,
                        "platform": 2608,
                        "layout": 1,
                        "position": 1,
                        "advert_type": 1,
                        "station_type": 0,
                        "author_name": "掘金一周",
                        "author_id": 53218623894222,
                        "title": "如何拥有 Star 700+的开源项目、 React18 新特性解读｜掘金一周 2022.05.11",
                        "brief": "【掘金一周 05.11】本期看点：如何有了星星700+的开源项目、 React18 新特性解读、打造 Go 语言最快的排序算法...",
                        "url": "https://juejin.cn/post/7096358153381478437?utm_source=feed1&utm_medium=web_feed&utm_campaign=juejin1week_0511",
                        "picture": "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ff7a2ff2b51497c9973c42a708afc8b~tplv-k3u1fbpfcp-watermark.image?",
                        "avatar": "https://p9-passport.byteacctimg.com/img/user-avatar/0779dd287afeb3e6a983deb0ff79d724~300x300.image",
                        "start_time": "0",
                        "end_time": "0",
                        "ctime": "1652360470",
                        "mtime": "1652360470",
                        "sale_count": 0,
                        "sale_price": 0,
                        "discount_rate": 0,
                        "digg_count": 0,
                        "comment_count": 0,
                        "topic": "",
                        "topic_id": "0",
                        "status": 1,
                        "item_user_info": {
                            "user_id": "53218623894222",
                            "user_name": "掘金一周",
                            "company": "",
                            "job_title": "",
                            "avatar_large": "https://p9-passport.byteacctimg.com/img/user-avatar/0779dd287afeb3e6a983deb0ff79d724~300x300.image",
                            "level": 3,
                            "description": "每周掘金优质文章",
                            "followee_count": 0,
                            "follower_count": 1395,
                            "post_article_count": 22,
                            "digg_article_count": 126,
                            "got_digg_count": 806,
                            "got_view_count": 99660,
                            "post_shortmsg_count": 12,
                            "digg_shortmsg_count": 13,
                            "isfollowed": false,
                            "favorable_author": 0,
                            "power": 1802,
                            "study_point": 0,
                            "university": {
                                "university_id": "0",
                                "name": "",
                                "logo": ""
                            },
                            "major": {
                                "major_id": "0",
                                "parent_id": "0",
                                "name": ""
                            },
                            "student_status": 0,
                            "select_event_count": 0,
                            "select_online_course_count": 0,
                            "identity": 0,
                            "is_select_annual": false,
                            "select_annual_rank": 0,
                            "annual_list_type": 0,
                            "extraMap": {},
                            "is_logout": 0,
                            "annual_info": []
                        }
                    }
                }
            ],
            "cursor": "1",
            "count": 1000,
            "has_more": true
        }`
    },
    {
        rule: '/v1/my/recommond',
        response: `{
            "code": 0,
            "data": [
                {
                    "id": 160074,
                    "aid": "160620",
                    "aidint": 160620,
                    "type": 1,
                    "views": 45,
                    "uuid": "6vqgSEzh1ZXaTucSIUaZ",
                    "status": 1,
                    "publish_time": 1652858411124,
                    "ctime": 1652858411079,
                    "utime": 1652858411079,
                    "vid": "",
                    "source": 1,
                    "sub_status": 0,
                    "score": 1652858411124,
                    "article_title": "风起云涌下的混合云管趋势预测",
                    "article_sharetitle": "风起云涌下的混合云管趋势预测",
                    "article_subtitle": "",
                    "article_summary": "在Gartner所发布的“监控，可观察性和云操作2021”技术成熟度曲线里，我们能清晰地看到混合云管理平台（CMP）不再是飘在空中的技术，如今已进入成熟发展的阶段。",
                    "article_cover": "https://static001.infoq.cn/resource/image/b4/ea/b499e62b0d70470c1a397b0f8f671fea.jpeg",
                    "article_cover_point": "{\"big\":{\"point\":{\"x\":0,\"y\":237,\"w\":1280,\"h\":720}},\"small\":{\"point\":{\"x\":0,\"y\":253,\"w\":1280,\"h\":720}},\"width\":1280,\"height\":1280}",
                    "author": [
                        {
                            "uid": 3007263,
                            "nickname": "优云研究院",
                            "avatar": "",
                            "active": 1,
                            "is_early": 0,
                            "ucode": "6E2F114B9B869B",
                            "uri": "/profile/6E2F114B9B869B/",
                            "author_type": 0,
                            "vip": 0
                        }
                    ],
                    "translator": null,
                    "planner": [
                        {
                            "uid": 1708397,
                            "nickname": "凌敏",
                            "avatar": "https://static001.geekbang.org/account/avatar/00/1a/11/6d/538cc67f.jpg",
                            "active": 1,
                            "is_early": 0,
                            "ucode": "16655B089D4524",
                            "uri": "/profile/16655B089D4524/",
                            "author_type": 1,
                            "vip": 0
                        }
                    ],
                    "topic": [
                        {
                            "id": 11,
                            "name": "云计算",
                            "alias": "cloud-computing"
                        },
                        {
                            "id": 38,
                            "name": "运维",
                            "alias": "operation"
                        },
                        {
                            "id": 68,
                            "name": "容器",
                            "alias": "container"
                        },
                        {
                            "id": 147,
                            "name": "企业动态",
                            "alias": " industrynews"
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
                    "label": [],
                    "out_id": null,
                    "word_count": 1705,
                    "front_type": 1,
                    "content_short": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"随着数字经济的快速发展，云计算、大数据、物联网、人工智能等新一代信息技术在传统行业中的应用不断深入，企业对于数字化转型的需求也越来越多，\"},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\"}],\"text\":\"“企业上云”成为驱动各行业数字化转型的重要手段。\"}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"“云”作为基础设施，在蓬勃建设之后，必然面临着如何去管理的问题。由于业务需求和建设阶段的不同，伴随着多种云形态\"},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\"}],\"text\":\"（私有云、公有云、专有云、混合云）\"},{\"type\":\"text\",\"text\":\"出现，混合云管理平台的建设成为企业数字化转型的必要组成部分。\"}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"在Gartner所发布的“监控，可观察性和云操作2021”技术成熟度曲线里，我们能清晰地看到混合云管理平台（CMP）不再是飘在空中的技术，如今已进入成熟发展的阶段，在未来两年内也会迎来新一轮快速增长。与此对应的混合云管理技术将会朝着以下6个方向发展：\"}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"image\",\"attrs\":{\"src\":\"https:\\/\\/static001.infoq.cn\\/resource\\/image\\/6a\\/03\\/6a46c46c9cf8ef3e65674cb396578c03.png\",\"alt\":null,\"title\":\"图：Hype Cycle for Monitoring，Observability and Cloud Operation 2021\",\"style\":[{\"key\":\"width\",\"value\":\"75%\"},{\"key\":\"bordertype\",\"value\":\"none\"}],\"href\":\"\",\"fromPaste\":false,\"pastePass\":false}},{\"type\":\"heading\",\"attrs\":{\"align\":null,\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"一、打造运维平台化体系\"}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"云和容器的应用进入深水区之后，运维管理也随之进入新的阶段。\"},{\"type\":\"text\",\"marks\":[{\"type\":\"strong\"}],\"text\":\"在层出不穷的技术栈和既有传统架构之间需要一条新的通道将现有的管理孤岛进行打通和整合，大运维体系应运而生\"},{\"type\":\"text\",\"text\":\"，并随之被客户和第三方研究机构不断提及。\"}]},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null}},{\"type\":\"paragraph\",\"attrs\":{\"indent\":0,\"number\":0,\"align\":null,\"origin\":null},\"content\":[{\"type\":\"text\",\"text\":\"现阶段实现大运维体系主要包含三种技术架构：通过混合云管理平台（CMP）打通运维体系；通过AIOps打通运维体系；通过平台运维架构（即Platform Ops）打通运维体系。\"}]}]}",
                    "is_fill_info": 0
                }
            ],
            "error": {},
            "extra": {
                "cost": 0.073133022,
                "request-id": "ccf6566e89df4e7df5ccb73970e00ab2@2@infoq"
            }
        }`
    }
]