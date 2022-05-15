import React, { useState, useEffect } from 'react'
import { CloseOutlined, CheckOutlined, SettingTwoTone, DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import './App.css'
import { Drawer, Button, List, Input, Row, Col, Select, Switch, Tabs, Segmented } from 'antd';
import 'antd/dist/antd.css';
import JsonEditor from './json-editor'

function App() {
  return (
    <div className="App">
      <JsonEditor />
    </div>
  )
}

export default App
