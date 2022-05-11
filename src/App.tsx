import { useState, useEffect } from 'react'
import Editor from "@monaco-editor/react";
import { CloseOutlined, CheckOutlined, SettingTwoTone, DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import './App.css'
import { Drawer, Button, Collapse, Radio, List, Divider, Input, Row, Col, Select, Switch, Tabs, Segmented } from 'antd';
import 'antd/dist/antd.css';

import MyEditor from './MyEditor'

const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;

const text = `{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.4.4",
    "antd": "^4.20.2",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-monaco-editor": "^0.48.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^1.3.0",
    "typescript": "^4.6.3",
    "vite": "^2.9.7",
    "vite-plugin-monaco-editor": "^1.0.10"
  }
}
`

const configData = {
  enabled: true,
  list: [
    {
      name: 'test1',
      match: 'Normal',
      // rule: '/shopList/gets',
      rule: '/budd/shop/draft/examine/list',
      enabled: true,
      cover: false,
      request: {
        body: '{"offset":10}',
        query: '{"latitude":120.0145264,"longitude":30.2831792,"queryContext":"肯德基"}',
        headers: '{"test": "test"}',
      },
      // response: '{"code":0,"data":{},"msg":"ok","success":true}'
      response: '{\n  "code": 0,\n  "data": {\n    "total": 12,\n    "list": [\n      {\n        "id": 1055,\n        "name": "1全家便利店111",\n        "address": "浙江省杭州市余杭区-海创园14幢",\n        "contactName": "沧尽",\n        "contactMobile": "13313131313",\n        "typeId": 261,\n        "typeName": "超市/便利店",\n        "gmtCreate": 1652169465730,\n        "examineStatus": 3,\n        "examineRejectReason": "代理商、运营型服务商的门店不能创建商机,shopId=1112119164",\n        "examineRemark": "代理商、运营型服务商的门店不能创建商机,shopId=1112119164",\n        "shopCreateSourceEnum": "CREATE_OPPO",\n        "defaultTip": "审核中,请等待审核通过后再开始签约及安装",\n        "mobile": "13313131313",\n        "creator": 617,\n        "examineTime": 1652169490440,\n        "parentTypeName": "购物",\n        "importSubject": 1,\n        "subjectBizId": 0\n      },\n      {\n        "id": 1054,\n        "name": "全家便利店九",\n        "address": "浙江省杭州市余杭区-未来科技城海创园5号楼一楼",\n        "contactName": "沧尽",\n        "contactMobile": "13333333333",\n        "typeId": 98,\n        "typeName": "美容/美发",\n        "gmtCreate": 1652082205742,\n        "examineStatus": 3,\n        "examineRejectReason": "代理商、运营型服务商的门店不能创建商机,shopId=1112119115",\n        "examineRemark": "代理商、运营型服务商的门店不能创建商机,shopId=1112119115",\n        "shopCreateSourceEnum": "CREATE_OPPO",\n        "defaultTip": "审核中,请等待审核通过后再开始签约及安装",\n        "mobile": "13333333333",\n        "creator": 617,\n        "examineTime": 1652082615856,\n        "parentTypeName": "休闲娱乐",\n        "importSubject": 1,\n        "subjectBizId": 0\n      }\n    ]\n  },\n  "msg": "ok",\n  "success": true\n}'
    },
    { name: 'test2', match: 'Normal', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test3', match: 'Normal', rule: '/test', enabled: false, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test4', match: 'RegExp', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test5', match: 'Normal', rule: '/test', enabled: false, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
    { name: 'test6', match: 'Normal', rule: '/test', enabled: true, cover: false, request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}`},
  ]
}

function App() {
  const [code, setCode] = useState<string>('// type your code...')
  const [visible, setVisible] = useState<boolean>(true)
  const [childrenDrawer, setChildrenDrawer] = useState<boolean>(false)
  const [settingType, setSettingType] = useState<'REQUEST' | 'RESPONSE'>('RESPONSE');
  const [config, setConfig] = useState<Record<string, any>>({});
  const [editorValue, setEditorValue] = useState<string | undefined>('');
  const [handledIndex, setHandledIndex] = useState<number>(0); // 当前操作的索引 index
  const [requestSettingType, setRequestSettingType] = useState<string>("1"); // 当前操作的索引 index

  const onChange = (e: any) => {
    console.log('radio checked', e.target.value);
    setSettingType(e.target.value);
  };

  useEffect(() => {
    setConfig(configData)
    // setEditorValue(JSON.stringify(JSON.parse(config.list[handledIndex].response), null, 2));
  }, [handledIndex])

  // 每次更新值都需要更新
  useEffect(() => {
    // 发送数据给注入到页面的 js
    postMessage({
      source: 'request-interceptor-iframe',
      payload: config,
    })

    // 更新 chrome.storage.local
    chrome.storage && chrome.storage.local.set({"request_interceptor_config": config});
    // console.log('config 更新了', config)
    window.myBridge(config)
  }, [config])

  const showDrawer = () => {
    setVisible(true)
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
    console.log(index, type, value)
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
      match: 'Normal',
      rule: '',
      enabled: true,
      cover: false,
      request: {
        body: '',
        query: '',
        headers: '',
      },
      // response: '{"code":0,"data":{},"msg":"ok","success":true}'
      response: ''
    });
    setConfig(newConfig);
  }

  return (
    <div className="App" style={{padding: '12px'}}>
      <header className="App-header">
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '12px 0',
        }}
      >
        <span>Enabled the interceptor: </span>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={config.enabled}
          onChange={enabledChange}
        />
      </div>

      <Row gutter={16} style={{width: '100%'}}>
        <Col span={2}>Setting</Col>
        <Col span={6}>Name</Col>
        <Col span={4}>Match</Col>
        <Col span={6}>Rule</Col>
        <Col span={3}><div style={{textAlign: 'right'}}>Enable</div></Col>
        <Col span={3}><div style={{ textAlign: 'right' }}>Delete</div></Col>
      </Row>

      <List
        dataSource={config.list}
        renderItem={(item: any, index) => (
          <List.Item>
            <Row gutter={16} style={{width: '100%'}}>
              <Col span={2}>
                <SettingTwoTone
                  style={{ cursor: 'pointer', fontSize: '24px' }}
                  onClick={() => {
                    setHandledIndex(index);
                    setEditorValue(config.list[index]["response"]);
                    setChildrenDrawer(true);
                  }}
                />
              </Col>

              <Col span={6}>
                <Input
                  value={item.name}
                  onChange={(e) => {
                    rulesChange(index, 'name', e.target.value)
                  }}
                />
              </Col>
              <Col span={4}>
                <Select
                  defaultValue="Normal"
                  style={{ width: '100%' }}
                  value={item.match}
                  onChange={(value) => {
                    rulesChange(index, 'match', value)
                  }}
                >
                  <Option value="Normal">Normal</Option>
                  <Option value="RegExp">RegExp</Option>
                </Select>
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
                <div style={{textAlign: 'right'}}>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    // defaultChecked
                    checked={item.enabled}
                    onChange={(value) => {
                      rulesChange(index, 'enabled', value)
                    }}
                  />
                </div>
              </Col>
              <Col span={3}>
                <div style={{ textAlign: 'right' }}>
                  <DeleteTwoTone
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                    onClick={() => {
                      deleteRule(index)
                    }}
                  />
                </div>
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

        <Drawer
          title="Two-level Drawer"
          width="70%"
          closable={false}
          onClose={() => {setChildrenDrawer(false)}}
          visible={childrenDrawer}
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
            } {
              setEditorValue(config.list[handledIndex]["request"]["body"]);
            }
          }}
        />
          {
            settingType === 'REQUEST' && (
              <Tabs
                activeKey={requestSettingType}
                onChange={(value) => {
                  setRequestSettingType(value);
                  console.log('value', value)
                  switch (value) {
                    case '1':
                      console.log(config.list[handledIndex]["request"]["body"])
                      setEditorValue(config.list[handledIndex]["request"]["body"]);
                      break;
                    case '2':
                      console.log(config.list[handledIndex]["request"]["query"])
                      setEditorValue(config.list[handledIndex]["request"]["query"]);
                      break;
                    case '3':
                      console.log(config.list[handledIndex]["request"]["headers"])
                      setEditorValue(config.list[handledIndex]["request"]["headers"]);
                      break;
                  }
                }}
              >
                <TabPane tab="Body" key="1" />
                <TabPane tab="Query" key="2" />
                <TabPane tab="Header" key="3" />
              </Tabs>
            )
          }

          <div style={{marginTop: '16px'}}>
            <MyEditor
              value={editorValue}
              onChange={(value) => {
                setEditorValue(value);
                const newConfig = {...config};

                if (settingType === 'RESPONSE') {
                  newConfig.list[handledIndex]["response"] = value;
                } else {
                  switch (requestSettingType) {
                    case '1':
                      newConfig.list[handledIndex]["request"]["body"] = value;
                      break;
                    case '2':
                      newConfig.list[handledIndex]["request"]["query"] = value;
                      break;
                    case '3':
                      newConfig.list[handledIndex]["request"]["headers"] = value;
                      break;
                  }
                }

                setConfig(newConfig);
                console.log(value)
              }}
            />
          </div>
        </Drawer>
      </header>
    </div>
  )
}

export default App
