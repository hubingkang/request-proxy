import { useState, useEffect } from 'react'
import { CloseOutlined, CheckOutlined, PlusCircleTwoTone, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './App.css'
import { Drawer, Button, List, Input, Row, Col, Radio, Switch, Tabs, Segmented, Tag, Space, Divider } from 'antd';
import 'antd/dist/antd.css';
import useUpdateEffect from './use-update-effect'
import SplitPane from 'react-split-pane'
import waitImg from './assest/wait.png'
import JsonEditor from './json-editor'

const { TabPane } = Tabs;

const request_proxy_config = {
  enabled: true,
  list: [
    {
      name: 'test1',
      match: 'Normal',
      // rule: '/shopList/gets',
      rule: '/budd/shop/draft/examine/list',
      enabled: true,
      state: [],
      request: {
        body: {
          overwritten: false,
          value: '{"offset":10}'
        },
        query: {
          overwritten: false,
          value: '{"latitude":120.0145264,"longitude":30.2831792,"queryContext":"肯德基"}'
        },
        headers: {
          overwritten: false,
          value: '{"offset":10}'
        },
      },
      // response: '{"code":0,"data":{},"msg":"ok","success":true}'
      response: '{"code":0,"data":{"total":12,"list":[{"id":1055,"name":"1全家便利店111","address":"浙江省杭州市余杭区-海创园14幢","contactName":"沧尽","contactMobile":"13313131313","typeId":261,"typeName":"超市/便利店","gmtCreate":1652169465730,"examineStatus":3,"examineRejectReason":"代理商、运营型服务商的门店不能创建商机,shopId=1112119164","examineRemark":"代理商、运营型服务商的门店不能创建商机,shopId=1112119164","shopCreateSourceEnum":"CREATE_OPPO","defaultTip":"审核中,请等待审核通过后再开始签约及安装","mobile":"13313131313","creator":617,"examineTime":1652169490440,"parentTypeName":"购物","importSubject":1,"subjectBizId":0},{"id":1054,"name":"全家便利店九","address":"浙江省杭州市余杭区-未来科技城海创园5号楼一楼","contactName":"沧尽","contactMobile":"13333333333","typeId":98,"typeName":"美容/美发","gmtCreate":1652082205742,"examineStatus":3,"examineRejectReason":"代理商、运营型服务商的门店不能创建商机,shopId=1112119115","examineRemark":"代理商、运营型服务商的门店不能创建商机,shopId=1112119115","shopCreateSourceEnum":"CREATE_OPPO","defaultTip":"审核中,请等待审核通过后再开始签约及安装","mobile":"13333333333","creator":617,"examineTime":1652082615856,"parentTypeName":"休闲娱乐","importSubject":1,"subjectBizId":0}]},"msg":"ok","success":true}'
    },
    { name: 'test2', match: 'Normal', rule: '/test', enabled: true, state: 2, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test3', match: 'Normal', rule: '/test', enabled: false, state: 3, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test4', match: 'RegExp', rule: '/test', enabled: true, state: 1, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test5', match: 'Normal', rule: '/test', enabled: false, state: 2, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test6', match: 'Normal', rule: '/test', enabled: true, state: 3, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
  ]
}

const debounce = (function () {
  let timer: any = null
  return function (fn: Function, delay = 300) {
    if (timer) {
      clearTimeout(timer)
    }
    // 非立即执行
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
})()

function App() {
  const [visible, setVisible] = useState<boolean>(false)
  const [settingType, setSettingType] = useState<'REQUEST' | 'RESPONSE'>('RESPONSE');
  const [config, setConfig] = useState<Record<string, any>>({});
  const [editorValue, setEditorValue] = useState<string>('');
  const [handledIndex, setHandledIndex] = useState<number>(0); // 当前操作的索引 index
  const [requestSettingType, setRequestSettingType] = useState<string>("body"); // 当前操作的索引 index

  // useEffect(() => {
  //   localStorage.setItem('request_proxy_config', JSON.stringify(request_proxy_config))
  // }, [])

  useEffect(() => {
    if (chrome.runtime) {
      console.log('Appjs - chrome.runtime', chrome.runtime)
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { source, payload } = message;
        if (source === 'content-to-iframe') {
          setConfig(payload)
        }
        sendResponse({test: 'test'});
      });
    }
  }, [])

  useEffect(() => {
    const fn = (event: KeyboardEvent) => {
      if (event.key === "Escape") postMessage2Background();
    }

    document.addEventListener("keydown",fn , false);
    return () => {
      document.removeEventListener("keydown",fn, false);
    }
  }, [])

  useEffect(() => {
    if (chrome.storage) {
      // 通过 postMessage 给 popup 改变图标的样式
      chrome.storage.local.get(['request_proxy_config'], (result) => {
        // console.log('%c App.js 中获取 storage', "font-size: 20px; color: green;", result)
        setConfig(result?.request_proxy_config || {});
      });
    } else {
      // 本地测试通过 localStorage 获取
      const result = localStorage.getItem('request_proxy_config') || JSON.stringify(request_proxy_config);
      setConfig(JSON.parse(result));
    }
  }, [])

  // 每次更新值都需要更新
  useUpdateEffect(() => {
    debounce(() => {
      // 发送数据给注入到主页面的 js
      if (chrome.storage) {
        window.parent.postMessage({
          source: 'iframe-to-wrapper',
          payload: config,
        }, "*")
    
        // console.log('config更新了--调用了 postMessage 和 set strorage')
        // 更新 chrome.storage.local
        chrome.storage.local.set({"request_proxy_config": config});
      } else {
        localStorage.setItem('request_proxy_config', JSON.stringify(config))
        // console.log('config更新了-- 设置了localstorage')
      }
    }, 300)
  }, [config])

  const postMessage2Background = () => {
    // 发送消息给 background
    chrome.runtime && chrome.runtime.sendMessage(chrome.runtime.id, {
      source: 'iframe-to-backgroud'
    });
  }


  // 全局开关
  const enabledChange = (value: boolean) => {
    setConfig({
      ...config,
      enabled: value
    })
  }

  // 修改表单内容
  const rulesChange = (index: any, type: any, value: any) => {
    const newConfig = {...config};
    newConfig.list[index][type] = value;
    setConfig(newConfig);
  }

  // 删除一条 rule
  const deleteRule = (index: number) => {
    const newConfig = {...config};
    newConfig.list.splice(index, 1)
    setConfig(newConfig);
  }

  // 新增一条 rule
  const addRule = () => {
    const newConfig = {...config};
    newConfig.list.push({
      name: '',
      rule: '',
      enabled: true,
      state: [],
      request: {
        body: {
          overwritten: false,
          value: ''
        },
        query: {
          overwritten: false,
          value: ''
        },
        headers: {
          overwritten: false,
          value: ''
        },
      },
      response: ''
    });
    setConfig(newConfig);
  }

  const cancelDrawer = () => {
    setSettingType('RESPONSE')
    setRequestSettingType('body')
    setVisible(false)
  }

  const getStateNode = (states: Array<any>) => {
    if (!states.length) {
      return <Tag color="default">Disabled</Tag>
    }

    if (states.length === 1) {
      return <Tag icon={<SyncOutlined spin />} color="success">Is matched</Tag>
    }

    return states.map(item => {
      switch (item) {
        case 'REQUEST_BODY_JSON_ERROR':
          return <Tag icon={<CloseCircleOutlined />} color="error">Check the request body JSON</Tag>;
        case 'REQUEST_QUERY_JSON_ERROR':
          return <Tag icon={<CloseCircleOutlined />} color="error">Check the request query JSON</Tag>
        case 'REQUEST_HEADERS_JSON_ERROR':
          return <Tag icon={<CloseCircleOutlined />} color="error">Check the request headers JSON</Tag>
      }
    })
  }

  return (
    <div className="App">
      <div
        style={{ zIndex: 100 }}
      >
        {/* @ts-ignore */}
        <SplitPane split="vertical" minSize={50} defaultSize={100}>
          <div
            style={{ 
              height: '100vh',
            }}
            onClick={() => {
              if (visible) {
                cancelDrawer()
              } else {
                postMessage2Background()
              }
            }}
        />
         
          <div
            className="site-drawer-render-in-current-wrapper"
            style={{
              padding: '12px',
              height: '100vh',
              background: '#fff'
            }}>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '12px 0',
              }}
            >
              <span>Enabled the proxy: </span>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={config.enabled}
                onChange={enabledChange}
              />
            </div>

            {
              config.enabled
              ? (
                <div>
                  <Row style={{fontSize: "16px", fontWeight: "bold", padding: '8px 15px 8px 0'}}>
                    <Col span={6}>Name</Col>
                    <Col span={6}> Match(String | RegExp)</Col>
                    <Col span={3}>State</Col>
                    <Col span={3}><div>Enabled</div></Col>
                    <Col span={6}><div>Action</div></Col>
                  </Row>

                  <div style={{ height: "calc(100vh - 120px)", overflowY: "scroll" }}>
                    <List
                      dataSource={config.list}
                      renderItem={(item: any, index) => (
                        <List.Item>
                          <Row gutter={16} style={{width: '100%', alignItems: 'center'}}>
                            <Col span={6}>
                              <Input
                                value={item.name}
                                onChange={(e) => {
                                  rulesChange(index, 'name', e.target.value)
                                }}
                              />
                            </Col>
                            
                            <Col span={6}>
                              <Input
                                value={item.rule}
                                onChange={(e) => {
                                  rulesChange(index, 'rule', e.target.value)
                                }}
                              />
                            </Col>

                            <Col span={3}>
                              { getStateNode(item.state) }
                            </Col>

                            <Col span={3}>
                              <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={item.enabled}
                                onChange={(value) => {
                                  rulesChange(index, 'enabled', value)
                                }}
                              />
                            </Col>
                            <Col span={6}>
                              <Space split={<Divider type="vertical" />}>
                                <a onClick={() => { deleteRule(index) }}>Delete</a>
                                <a
                                  onClick={() => {
                                    setHandledIndex(index);
                                    setEditorValue(config.list[index]["response"]);
                                    setVisible(true);
                                  }}
                                >Setting</a>
                              </Space>
                            </Col>
                          </Row>
                        </List.Item>
                      )}
                    />
                  
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        type="dashed"
                        onClick={addRule}
                        block
                        icon={<PlusCircleTwoTone style={{ fontSize: '24px' }}/> }
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        size="large"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <Drawer
                    title="Setting"
                    width="100%"
                    onClose={cancelDrawer}
                    visible={visible}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                  >
                    <Segmented
                      block
                      options={[
                        { label: 'Response data', value: 'RESPONSE' },
                        { label: 'Request params', value: 'REQUEST' },
                      ]}
                      value={settingType}
                      onChange={(value) => {
                        setSettingType(value as any);
                        if (value === "RESPONSE") {
                          setEditorValue(config.list[handledIndex]["response"]);
                        } else {
                          setEditorValue(config.list[handledIndex]["request"][requestSettingType]["value"]);
                        }
                      }}
                    />
                      {
                        settingType === 'REQUEST' && (
                          <div style={{ display: 'flex' }}>
                            <Tabs
                              style={{ flex: 1 }}
                              activeKey={requestSettingType}
                              onChange={(value) => {
                                setRequestSettingType(value);
                                switch (value) {
                                  case 'body':
                                    setEditorValue(config.list[handledIndex]["request"]["body"]["value"]);
                                    break;
                                  case 'query':
                                    setEditorValue(config.list[handledIndex]["request"]["query"]["value"]);
                                    break;
                                  case 'headers':
                                    setEditorValue(config.list[handledIndex]["request"]["headers"]["value"]);
                                    break;
                                }
                              }}
                            >
                              <TabPane tab="Body" key="body" />
                              <TabPane tab="Query" key="query" />
                              <TabPane tab="Headers" key="headers" />
                            </Tabs>

                            <Radio.Group
                              value={config.list[handledIndex]["request"][requestSettingType]["overwritten"]}
                              buttonStyle="solid"
                              style={{ marginTop: 14 }}
                              onChange={(e) => {
                                const newConfig = {...config};
                                newConfig.list[handledIndex]["request"][requestSettingType]["overwritten"] = e.target.value;
                                setConfig(newConfig);
                              }}
                            >
                              <Radio.Button value={false}>Additional</Radio.Button>
                              <Radio.Button
                                value={true}
                                // disabled={requestSettingType === 'headers'}
                              >Overwritten</Radio.Button>
                            </Radio.Group>
                          </div>
                        )
                      }

                      <div style={{marginTop: '16px'}}>
                        <JsonEditor
                          defaultValue={editorValue} // 不是 control 模式
                          height={
                            settingType === 'REQUEST' ? 'calc(100vh - 150px - 62px)' : 'calc(100vh - 150px)'
                          }
                          onChange={(value) => {
                            const newConfig = {...config};
                            if (settingType === 'RESPONSE') {
                              newConfig.list[handledIndex]["response"] = value;
                            } else {
                              switch (requestSettingType) {
                                case 'body':
                                  newConfig.list[handledIndex]["request"]["body"]["value"] = value;
                                  break;
                                case 'query':
                                  newConfig.list[handledIndex]["request"]["query"]["value"] = value;
                                  break;
                                case 'headers':
                                  newConfig.list[handledIndex]["request"]["headers"]["value"] = value;
                                  break;
                              }
                            }
                            setConfig(newConfig);
                          }}
                        />
                      </div>
                  </Drawer>
                </div>
              )
              : (
                <div className="wait-image-container">
                  <img src={waitImg} alt="" width="50%"/>
                  <div>Request proxy is disabled</div>
                </div>
              )
            }
          </div>
        </SplitPane>

      </div>
    </div>
  )
}

export default App
