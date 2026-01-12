# React Hooks 指南 (写给 Python 开发者)

本文档旨在帮助熟悉 Python 的开发者快速理解 React 项目中核心 Hooks (`useState`, `useEffect`) 的概念。

## 核心概念：组件 (Component) 即函数

在 React 中，你看到的组件（如 `Quiz`）本质上就是一个 **Python 函数**。

- **输入**：`props` (类似 Python 函数的参数 `**kwargs`)
- **输出**：`JSX` (类似 Python 函数返回渲染好的 HTML 字符串)
- **特点**：当状态发生变化时，这个函数会**重新执行**一遍（重新渲染）。

## 1. `useState`: 拥有“记忆”的变量

React 函数组件每次重新渲染都会重新运行函数体。如果我们在函数里定义普通变量 `x = 0`，下次渲染时 `x` 又会变回 0。`useState` 就是为了解决这个问题。

### Python 类比

你可以把 `useState` 想象成 Python 类中的 **实例属性 (`self.variable`)**。

**Python Class 方式：**

```python
class Quiz:
    def __init__(self):
        self._current_index = 0  # 状态初始化

    @property
    def current_index(self):
        return self._current_index

    def set_current_index(self, value):
        self._current_index = value
        self.render()  # 更新状态后，触发重新渲染
```

**React Hooks 方式：**

```tsx
const [currentIndex, setCurrentIndex] = useState(0);
```

### 语法解析

```tsx
//      变量名        修改变量的方法              初始值
const [currentIndex, setCurrentIndex] = useState(0);
```

这利用了 **解构赋值** (Destructuring)，类似于 Python 的：

```python
current_index, set_current_index = use_state(0)
```

### 关键点

1. **读取**：直接使用 `currentIndex`。
2. **写入**：**绝不能**直接赋值 (如 `currentIndex = 1`)，必须调用 `setCurrentIndex(1)`。
3. **副作用**：调用 `set` 函数会通知 React **重新运行整个组件函数**，从而更新 UI。

### 本项目中的例子 (`src/pages/Quiz/index.tsx`)

```tsx
// 是否显示答案反馈
// Python: self.show_answer = False
const [showAnswer, setShowAnswer] = useState(false);

// 点击按钮时：
const handleOptionSelect = () => {
  // Python: self.show_answer = True (并触发 UI 更新)
  setShowAnswer(true);
};
```

---

## 2. `useEffect`: 处理“副作用”与生命周期

因为 React 组件只是函数，它们本身应是纯函数（Pure Function，同样的输入产生同样的输出）。但我们需要做 API 请求、修改文档标题、订阅事件等“副作用”。`useEffect` 就是做这些事的地方。

### Python 类比

你可以把 `useEffect` 理解为 Python 类的 **`__init__`** (初始化) 加上 **属性监听器 (Property Observer)**。

**场景 A：只在组件挂载时运行一次 (类似 `__init__`)**

```tsx
useEffect(() => {
  console.log("组件启动了");
  fetchData();
}, []); // 空数组表示不依赖任何变量，仅运行一次
```

**Python 类比：**

```python
class Quiz:
    def __init__(self):
        print("组件启动了")
        self.fetch_data()
```

**场景 B：当某些变量变化时运行 (类似 Observer)**

```tsx
// 当 freq (频率) 或 day (天数) 变化时，重新加载成语
useEffect(() => {
  reloadIdioms(freq, day);
}, [freq, day]); // 依赖列表
```

**Python 类比：**

```python
class Quiz:
    # 伪代码：监听属性变化
    def __setattr__(self, name, value):
        super().__setattr__(name, value)
        if name in ['freq', 'day']:
            self.reload_idioms(self.freq, self.day)
```

### 本项目中的例子

在 `Quiz` 组件中，我们有这样一段逻辑：

```tsx
// 监听 filteredIdioms (筛选后的成语列表) 的变化
useEffect(() => {
  if (filteredIdioms.length > 0) {
    // Python: list comprehension 生成题目
    const generated = filteredIdioms.map(idiom => { ... });
    setQuizQuestions(generated);
  }
}, [filteredIdioms]); // 只要 filteredIdioms 变了，就重新生成题目
```

这确保了每当用户改变了数据源（比如换了一天学习），题目列表也会自动重新计算并更新。

---

## 总结

| 概念             | React (Hooks)          | Python (Class/Concept)              |
| :--------------- | :--------------------- | :---------------------------------- |
| **组件**         | `function Quiz() {}`   | `class Quiz:`                       |
| **状态定义**     | `useState(0)`          | `self.value = 0` (在 `__init__` 中) |
| **状态更新**     | `setValue(newVal)`     | `self.value = newVal` + `render()`  |
| **初始化逻辑**   | `useEffect(fn, [])`    | `__init__`                          |
| **响应数据变化** | `useEffect(fn, [dep])` | Observer / Setter 钩子              |
