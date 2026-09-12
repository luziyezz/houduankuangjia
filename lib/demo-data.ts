export type OrderStatus = "已完成" | "处理中" | "待确认";

export type Order = {
  id: string;
  customer: string;
  initials: string;
  item: string;
  amount: number;
  date: string;
  status: OrderStatus;
};

export const trendData = Array.from({ length: 30 }, (_, index) => {
  const wave = Math.sin(index * 0.72) * 680 + Math.cos(index * 1.37) * 240;
  return {
    label: `${String(index + 1).padStart(2, "0")}日`,
    revenue: Math.round(2500 + index * 94 + wave),
  };
});

const revenueTotal = trendData.reduce((total, point) => total + point.revenue, 0);

export const metrics = [
  { title: "总收入", value: new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(revenueTotal), change: "+12.8%", positive: true, note: "较上期" },
  { title: "活跃客户", value: "3,842", change: "+8.2%", positive: true, note: "较上期" },
  { title: "订单总量", value: "1,286", change: "-2.4%", positive: false, note: "较上期" },
] as const;

export const orders: Order[] = [
  { id: "NX-20260912-0842", customer: "陈思远", initials: "陈", item: "企业协作专业版", amount: 4299, date: "2026-09-12 14:32", status: "已完成" },
  { id: "NX-20260912-0841", customer: "林以南", initials: "林", item: "团队空间升级", amount: 1899, date: "2026-09-12 12:18", status: "处理中" },
  { id: "NX-20260912-0840", customer: "张悦宁", initials: "张", item: "数据分析套件", amount: 3280, date: "2026-09-12 10:46", status: "已完成" },
  { id: "NX-20260911-0839", customer: "周明哲", initials: "周", item: "企业协作基础版", amount: 899, date: "2026-09-11 17:05", status: "待确认" },
  { id: "NX-20260911-0838", customer: "许知微", initials: "许", item: "自动化工作流", amount: 2499, date: "2026-09-11 15:27", status: "已完成" },
  { id: "NX-20260911-0837", customer: "顾言之", initials: "顾", item: "团队空间升级", amount: 1899, date: "2026-09-11 09:12", status: "处理中" },
];
