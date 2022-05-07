import { useState, useEffect } from 'react'
import Editor, { useMonaco } from "@monaco-editor/react";
import { CloseOutlined, CheckOutlined, SettingTwoTone, DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import './App.css'
import { Drawer, Button, Collapse, Radio, List, Divider, Input, Row, Col, Select, Switch, Tabs, Segmented } from 'antd';
import 'antd/dist/antd.css';

const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

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
      rule: '/test',
      enabled: true,
      setting: {
        request: {
          body: '{"offset":0,"pageSize":10,"queryContext":"肯德基","poiLatitude":120.0145264,"poiLongitude":30.2831792}',
          query: '{"latitude":120.0145264,"longitude":30.2831792,"queryContext":"肯德基"}',
          headers: '{"testHeader": "test"}',
        },
        response: '{"code":0,"data":{},"msg":"ok","success":true}'
      },
    },
    { name: 'test2', match: 'Normal', rule: '/test', enabled: true, setting: { request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}` } },
    { name: 'test3', match: 'Normal', rule: '/test', enabled: false, setting: { request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}` } },
    { name: 'test4', match: 'Normal', rule: '/test', enabled: true, setting: { request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}` } },
    { name: 'test5', match: 'Normal', rule: '/test', enabled: false, setting: { request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}` } },
    { name: 'test6', match: 'Normal', rule: '/test', enabled: true, setting: { request: {body: `{}`, query: `{}`, headers: `{}`}, response: `{}` } },
  ]
}

function App() {
  const monaco = useMonaco();

  const [code, setCode] = useState<string>('// type your code...')
  const [visible, setVisible] = useState<boolean>(true)
  const [childrenDrawer, setChildrenDrawer] = useState<boolean>(false)
  const [settingType, setSettingType] = useState<'REQUEST' | 'RESPONSE'>('RESPONSE');
  const [config, setConfig] = useState<Record<string, any>>(configData);
  const [editorValue, setEditorValue] = useState<string>('');
  const [handledIndex, setHandledIndex] = useState<number>(0); // 当前操作的索引 index

  const onChange = (e: any) => {
    console.log('radio checked', e.target.value);
    setSettingType(e.target.value);
  };

  useEffect(() => {
    // childrenDrawer
    // if (handledIndex) {
    //   // setEditorValue
    // }
    setEditorValue(JSON.stringify(JSON.parse(config.list[handledIndex].setting?.response), null, 2));
  }, [handledIndex])

  useEffect(() => {
    // do conditional chaining
    // monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // if (!monaco) return;
    // monaco.editor.defineTheme('myTheme', {
    //   base: 'vs',
    //   inherit: true,
    //   rules: [{ background: 'EDF9FA' }],
    //   colors: {
    //     'editor.foreground': '#abb2bf',
    //     'editor.background': '#282c34',
    //     'editorCursor.foreground': '#528bff',
    //     'editor.lineHighlightBackground': '#2c313c',
    //     'editorLineNumber.foreground': '#495162',
    //     'editor.selectionBackground': '#67769660',
    //     'editor.inactiveSelectionBackground': '#323842'
    //   }
    // });
    // monaco.editor.setTheme('myTheme');

    // or make sure that it exists by other ways
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);

  const showDrawer = () => {
    setVisible(true)
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary" onClick={() => setVisible(true)}>
          Open drawer
        </Button>

        <Drawer
          title="Multi-level drawer"
          width="70%"
          closable={false}
          onClose={() => setVisible(false)}
          visible={visible}
        >

          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              margin: '12px 0'
            }}
          >
            <span>Enabled the interceptor: </span>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
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
                        setChildrenDrawer(true);
                      }}
                    />
                  </Col>

                  <Col span={6}>
                    <Input value={item.name}/>
                  </Col>
                  <Col span={4}>
                    <Select defaultValue="Normal" style={{ width: '100%' }} value={item.match}>
                      <Option value="Normal">Normal</Option>
                      <Option value="Regex">Regex</Option>
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Input value={item.rule} />
                  </Col>
                  <Col span={3}>
                    <div style={{textAlign: 'right'}}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        // defaultChecked
                        checked={item.enabled}
                      />
                    </div>
                  </Col>
                  <Col span={3}>
                    <div style={{ textAlign: 'right' }}>
                      <DeleteTwoTone style={{ cursor: 'pointer', fontSize: '24px' }} />
                    </div>
                  </Col>
                </Row>
              </List.Item>
            )}
          />

          <div style={{ textAlign: 'center' }}>
            {/* <PlusCircleTwoTone style={{ cursor: 'pointer', fontSize: '24px' }} /> */}
            <Button
              type="dashed"
              onClick={() => {}}
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
            }}
          />

            {/* <Divider orientation="left" orientationMargin={0}>
              {
                settingType === 1 ? 'Response data' : 'Request params'
              }
            </Divider> */}

            {/* <Radio.Group onChange={onChange} value={settingType}>
              <Radio value={1}>Modifying response data</Radio>
              <Radio value={2}>Modifying request params</Radio>
            </Radio.Group> */}

            {/* <h3>请求参数</h3> */}

            {/* <Divider orientation="left" orientationMargin={0}>
              {
                settingType === 1 ? 'Response data' : 'Request params'
              }
            </Divider> */}
            {
              settingType === 'REQUEST' && (
                <Tabs defaultActiveKey="1" onChange={console.log}>
                  <TabPane tab="Body" key="2" />
                  <TabPane tab="Query" key="1" />
                  <TabPane tab="Header" key="3" />
                </Tabs>
              )
            }
            

            <div style={{marginTop: '16px'}}>
              <Editor
                height="70vh"
                defaultLanguage="json"
                defaultValue="{}"
                theme="vs-dark"
                value={editorValue}
                onValidate={(markers) => {
                  if (markers.length) {
                    console.log("当前格式不正确")
                  } else {

                  }
                  // markers.forEach(marker => console.log("onValidate:", markers));
                }}
                onChange={console.log}
              />
            </div>

            {/* <Collapse defaultActiveKey={['1']}>
              <Panel header="修改请求参数" key="1">
                <Editor
                  height="500px"
                  defaultLanguage="json"
                  // defaultLanguage="javascript"
                  // defaultValue="// some comment"
                  theme="vs-dark"
                />
              </Panel>
              <Panel header="修改返回参数" key="2">
                <Editor
                  height="500px"
                  defaultLanguage="json"
                  // defaultLanguage="javascript"
                  // defaultValue="// some comment"
                  theme="vs-dark"
                />
              </Panel>
            </Collapse> */}
            
          </Drawer>
        </Drawer>
      </header>
    </div>
  )
}

export default App
