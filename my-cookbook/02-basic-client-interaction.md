# 02. 基础客户端交互模式

## 场景
需要在页面中使用React状态和事件处理。

## 关键代码模式
```tsx
'use client'; // 必须添加在使用了状态的组件顶部

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState(''); // 状态管理
  const [output, setOutput] = useState('');

  const handleAction = () => {
    // 事件处理逻辑
    setOutput(`处理结果: ${state}`);
  };

  return (
    <div>
      <input 
        value={state} 
        onChange={(e) => setState(e.target.value)} 
      />
      <button onClick={handleAction}>执行</button>
      {output && <div>{output}</div>}
    </div>
  );
}