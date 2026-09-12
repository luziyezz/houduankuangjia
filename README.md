# NexusAdmin Dashboard

一个独立可运行的电脑端后台界面演示，使用 Next.js 15 App Router、Tailwind CSS 4、项目内 shadcn/ui 风格组件和 Recharts。

## 启动

需要 Node.js 20.9 或更高版本，以及 pnpm 11。

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000>。生产构建：

```bash
pnpm check
pnpm build
pnpm start
```

## 范围

- 已实现：电脑端固定导航、全局搜索建议、指标卡、7/30 天图表、订单搜索表格、顶部通知/帮助/头像弹层。
- 指标和订单都是内置演示数据；没有后端、登录或真实订单接口。
- 其他导航模块展示明确的占位说明，避免误以为已实现业务功能。
- 本轮只设计电脑端，不将移动端作为验收目标。
