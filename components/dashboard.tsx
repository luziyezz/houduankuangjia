"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChartNoAxesCombined,
  CircleHelp,
  LayoutDashboard,
  Megaphone,
  PackageSearch,
  Search,
  Settings2,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { metrics, orders, trendData, type OrderStatus } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type NavItem = { label: string; icon: LucideIcon };
type Popover = "notifications" | "help" | "profile" | null;
type Range = "30天" | "7天";

const navItems: NavItem[] = [
  { label: "仪表盘", icon: LayoutDashboard },
  { label: "客户管理", icon: UsersRound },
  { label: "订单追踪", icon: PackageSearch },
  { label: "财务报表", icon: ChartNoAxesCombined },
  { label: "营销活动", icon: Megaphone },
  { label: "系统设置", icon: Settings2 },
];

const statusColors: Record<OrderStatus, string> = {
  已完成: "bg-[#22C55E]",
  处理中: "bg-[#3B82F6]",
  待确认: "bg-[#9CA3AF]",
};

const money = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

function SearchResults({
  query,
  onNavigate,
  onMetric,
  onHelp,
}: {
  query: string;
  onNavigate: (label: string) => void;
  onMetric: () => void;
  onHelp: () => void;
}) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  const menuMatches = navItems.filter((item) => item.label.toLowerCase().includes(normalized));
  const metricMatches = metrics.filter((item) => item.title.toLowerCase().includes(normalized));
  const orderMatches = orders.filter((order) => `${order.id} ${order.customer} ${order.item} ${order.status}`.toLowerCase().includes(normalized));
  const helpMatch = ["文档", "帮助", "使用指南"].some((term) => term.includes(normalized));

  return (
    <div className="absolute top-12 left-0 z-50 w-full rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
      {menuMatches.length > 0 && <p className="px-2 py-1 text-[11px] font-semibold text-[#9CA3AF]">菜单</p>}
      {menuMatches.map((item) => (
        <button key={item.label} type="button" onClick={() => onNavigate(item.label)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[#374151] transition-all duration-200 ease-out hover:bg-[#F3F4F6]">
          <item.icon className="size-4 text-[#6B7280]" aria-hidden="true" />{item.label}
        </button>
      ))}
      {metricMatches.length > 0 && <p className="px-2 py-1 text-[11px] font-semibold text-[#9CA3AF]">指标</p>}
      {metricMatches.map((item) => (
        <button key={item.title} type="button" onClick={onMetric} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[#374151] transition-all duration-200 ease-out hover:bg-[#F3F4F6]">
          <ChartNoAxesCombined className="size-4 text-[#6B7280]" aria-hidden="true" />{item.title}
        </button>
      ))}
      {helpMatch && <><p className="px-2 py-1 text-[11px] font-semibold text-[#9CA3AF]">文档</p><button type="button" onClick={onHelp} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[#374151] transition-all duration-200 ease-out hover:bg-[#F3F4F6]"><CircleHelp className="size-4 text-[#6B7280]" aria-hidden="true" />使用指南</button></>}
      {orderMatches.length > 0 && <p className="px-2 py-1 text-[11px] font-semibold text-[#9CA3AF]">订单 · 同时筛选下方表格</p>}
      {orderMatches.slice(0, 3).map((order) => (
        <div key={order.id} className="flex items-center justify-between gap-3 px-2 py-1.5 text-xs text-[#374151]"><span>{order.id}</span><span className="text-[#6B7280]">{order.customer}</span></div>
      ))}
      {menuMatches.length + metricMatches.length + orderMatches.length + Number(helpMatch) === 0 && (
        <p className="px-2 py-3 text-sm text-[#6B7280]">没有找到匹配内容</p>
      )}
    </div>
  );
}

function HeaderPopover({ type }: { type: Exclude<Popover, null> }) {
  return (
    <div role="dialog" aria-label={type === "notifications" ? "通知" : type === "help" ? "帮助" : "个人资料"} className="absolute top-12 right-0 z-50 w-72 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-lg">
      {type === "notifications" ? (
        <><h3 className="mb-3 text-sm font-semibold text-[#111827]">通知</h3><p className="rounded-lg bg-[#F8FAFC] p-3 text-xs leading-5 text-[#374151]">演示环境已就绪，所有图表和订单均为示例数据。</p></>
      ) : type === "help" ? (
        <><h3 className="mb-3 text-sm font-semibold text-[#111827]">使用提示</h3><p className="text-xs leading-5 text-[#6B7280]">可搜索菜单、指标、文档和订单；图表支持切换 7 天与 30 天视图。</p></>
      ) : (
        <><h3 className="text-sm font-semibold text-[#111827]">演示管理员</h3><p className="mt-1 text-xs text-[#6B7280]">NexusAdmin · 本地演示</p></>
      )}
    </div>
  );
}

export function Dashboard() {
  const [activeNav, setActiveNav] = useState("仪表盘");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<Range>("30天");
  const [popover, setPopover] = useState<Popover>(null);
  const chartData = range === "7天" ? trendData.slice(-7) : trendData;
  const chartTotal = chartData.reduce((total, point) => total + point.revenue, 0);
  const filteredOrders = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return orders;
    const matchesNavigation = navItems.some((item) => item.label.toLowerCase().includes(value));
    const matchesMetric = metrics.some((item) => item.title.toLowerCase().includes(value));
    const matchesHelp = ["文档", "帮助", "使用指南"].some((term) => term.includes(value));
    return matchesNavigation || matchesMetric || matchesHelp
      ? orders
      : orders.filter((order) => `${order.id} ${order.customer} ${order.item} ${order.status}`.toLowerCase().includes(value));
  }, [query]);

  function navigate(label: string) {
    setActiveNav(label);
    setQuery("");
    setPopover(null);
  }

  function jumpToMetrics() {
    setActiveNav("仪表盘");
    setQuery("");
    requestAnimationFrame(() => document.getElementById("metrics")?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-[#E5E7EB] bg-white" aria-label="主导航">
        <div className="flex h-16 items-center gap-3 border-b border-[#F3F4F6] px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#3B82F6] text-white shadow-sm"><Sparkles className="size-[18px]" strokeWidth={2.3} aria-hidden="true" /></div>
          <span className="text-[15px] font-bold tracking-[-0.025em] text-[#111827]">NexusAdmin</span>
        </div>
        <div className="px-3 pt-8"><p className="px-3 pb-3 text-[11px] font-semibold tracking-[0.08em] text-[#9CA3AF]">工作空间</p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => {
              const active = activeNav === label;
              return (
                <button key={label} type="button" aria-current={active ? "page" : undefined} onClick={() => navigate(label)} className={cn("relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500", active ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]")}>
                  {active && <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-r bg-[#3B82F6]" aria-hidden="true" />}
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.8} aria-hidden="true" />{label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t border-[#F3F4F6] p-6">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]"><span className="size-2 rounded-full bg-[#22C55E]" />演示环境运行正常</div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">© 2026 NexusAdmin</p>
        </div>
      </aside>

      <div className="ml-[240px] min-h-screen">
        <header className="sticky top-0 z-30 grid h-16 grid-cols-[1fr_minmax(320px,420px)_1fr] items-center gap-6 border-b border-[#E5E7EB] bg-white px-8">
          <div className="flex items-center gap-2 whitespace-nowrap text-[13px]"><span className="text-[#9CA3AF]">首页</span><span className="text-[#D1D5DB]">/</span><span className="font-medium text-[#6B7280]">{activeNav === "仪表盘" ? "数据看板" : activeNav}</span></div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
            <Input aria-label="搜索菜单、指标或文档" placeholder="搜索菜单、指标或文档..." value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }} className="h-9 border-[#E5E7EB] bg-[#F9FAFB] pl-10 focus:bg-white" />
            <SearchResults query={query} onNavigate={navigate} onMetric={jumpToMetrics} onHelp={() => { setQuery(""); setPopover("help"); }} />
          </div>
          <div className="relative flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" type="button" aria-label="通知" aria-expanded={popover === "notifications"} onClick={() => setPopover(popover === "notifications" ? null : "notifications")}><Bell className="size-[18px]" /></Button>
            <Button variant="ghost" size="icon" type="button" aria-label="帮助" aria-expanded={popover === "help"} onClick={() => setPopover(popover === "help" ? null : "help")}><CircleHelp className="size-[18px]" /></Button>
            <span className="mx-2 h-6 w-px bg-[#E5E7EB]" aria-hidden="true" />
            <button type="button" aria-label="个人资料" aria-expanded={popover === "profile"} onClick={() => setPopover(popover === "profile" ? null : "profile")} className="flex size-9 items-center justify-center rounded-full bg-[#DBEAFE] text-xs font-semibold text-[#2563EB] outline-none transition-all duration-200 ease-out hover:ring-4 hover:ring-[#EFF6FF] focus-visible:ring-2 focus-visible:ring-[#3B82F6]">林</button>
            {popover && <HeaderPopover type={popover} />}
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-8 py-8">
          {activeNav === "仪表盘" ? (
            <>
              <div className="mb-8 flex items-end justify-between">
                <div><p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[#3B82F6]">OVERVIEW</p><h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#111827]">数据看板</h1><p className="mt-2 text-sm text-[#6B7280]">掌握业务脉搏，让每一项决策都有据可依。</p></div>
                <span className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#6B7280]">演示数据 · 非实时</span>
              </div>

              <section id="metrics" aria-label="关键指标" className="grid grid-cols-3 gap-6">
                {metrics.map((metric) => (
                  <Card key={metric.title} className="transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="p-6">
                      <p className="text-xs font-medium text-[#6B7280]">{metric.title}</p>
                      <p className="mt-4 text-[30px] leading-none font-semibold tracking-[-0.04em] text-[#111827] tabular-nums">{metric.value}</p>
                      <div className="mt-5 flex items-center gap-2 text-xs"><span className={cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 font-semibold", metric.positive ? "bg-[#ECFDF3] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]")}>{metric.positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{metric.change}</span><span className="text-[#9CA3AF]">{metric.note}</span></div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <Card className="mt-6">
                <CardHeader className="flex flex-row items-start justify-between gap-6">
                  <div><CardTitle>营收趋势</CardTitle><CardDescription className="mt-1">查看业务收入在所选周期内的变化</CardDescription></div>
                  <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-1" role="group" aria-label="选择图表时间范围">
                    {(["7天", "30天"] as const).map((option) => <button key={option} type="button" aria-pressed={range === option} onClick={() => setRange(option)} className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-out", range === option ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]")}>{option}</button>)}
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="mb-6 flex items-baseline gap-3"><span className="text-[26px] font-semibold tracking-[-0.035em] text-[#111827] tabular-nums">{money.format(chartTotal)}</span><span className="text-xs text-[#9CA3AF]">所选周期合计</span></div>
                  <div className="h-[290px] w-full" role="img" aria-label={`${range}营收趋势折线图，演示数据`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                        <defs><linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.22} /><stop offset="100%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient></defs>
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 11 }} tickMargin={14} interval={range === "30天" ? 4 : 0} />
                        <YAxis hide domain={["dataMin - 600", "dataMax + 600"]} />
                        <Tooltip cursor={{ stroke: "#CBD5E1", strokeDasharray: "4 4" }} contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 8px 24px rgba(15,23,42,.08)", fontSize: 12 }} formatter={(value) => [money.format(Number(value)), "营收"]} />
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 3 }} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between gap-6 pb-5"><div><CardTitle>近期订单</CardTitle><CardDescription className="mt-1">最新业务动态与订单状态</CardDescription></div><span className="text-xs text-[#9CA3AF]">共 {filteredOrders.length} 条</span></CardHeader>
                <Table>
                  <TableHeader><TableRow className="hover:bg-white"><TableHead>订单编号</TableHead><TableHead>客户</TableHead><TableHead>商品 / 服务</TableHead><TableHead className="text-right">金额</TableHead><TableHead>日期</TableHead><TableHead>状态</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => <TableRow key={order.id}>
                      <TableCell className="font-medium text-[#374151]"><span className={cn("mr-3 inline-block size-2 rounded-full", statusColors[order.status])} aria-hidden="true" />{order.id}</TableCell>
                      <TableCell><span className="inline-flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-[#F3F4F6] text-[11px] font-medium text-[#6B7280]">{order.initials}</span>{order.customer}</span></TableCell>
                      <TableCell className="text-[#6B7280]">{order.item}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{money.format(order.amount)}</TableCell>
                      <TableCell className="whitespace-nowrap text-[#6B7280]">{order.date}</TableCell>
                      <TableCell><span className="text-xs font-medium">{order.status}</span></TableCell>
                    </TableRow>)}
                    {filteredOrders.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center text-sm text-[#9CA3AF]">没有找到匹配的订单</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Card>
            </>
          ) : (
            <><div className="mb-8"><p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[#3B82F6]">WORKSPACE</p><h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#111827]">{activeNav}</h1><p className="mt-2 text-sm text-[#6B7280]">这是 Dashboard 的导航结构演示。</p></div><Card><CardContent className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6]"><Sparkles className="size-6" /></div><h2 className="text-lg font-semibold text-[#111827]">{activeNav}模块</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#6B7280]">此示例专注于数据看板的视觉与交互；其他业务模块尚未接入真实数据。</p><Button className="mt-6" onClick={() => navigate("仪表盘")}>返回数据看板</Button></CardContent></Card></>
          )}
        </main>
      </div>
    </div>
  );
}
