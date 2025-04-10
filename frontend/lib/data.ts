import { BookOpen, Calendar, CheckCircle2, Lightbulb, Users, Zap } from "lucide-react"

export const scoringCategories = [
  {
    id: 1,
    name: "创新贡献",
    description: "为 AI 治理带来创新思路和方法",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: 2,
    name: "知识分享",
    description: "分享 AI 治理相关知识和最佳实践",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    name: "团队协作",
    description: "促进跨部门协作解决治理问题",
    icon: Users,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    name: "效率提升",
    description: "提高治理流程效率",
    icon: Zap,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 5,
    name: "考勤",
    description: "保持良好的出勤记录",
    icon: Calendar,
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    id: 6,
    name: "任务完成",
    description: "按时高质量完成分配的任务",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-800",
  },
]

export const avatars = {
  张明: {
    src: "/placeholder.svg?height=40&width=40",
    fallback: "张",
    department: "研发部",
  },
  李华: {
    src: "/placeholder.svg?height=40&width=40",
    fallback: "李",
    department: "数据部",
  },
  王芳: {
    src: "/placeholder.svg?height=40&width=40",
    fallback: "王",
    department: "伦理部",
  },
  当前用户: {
    src: "/placeholder.svg?height=40&width=40",
    fallback: "我",
    department: "您的部门",
  },
}

export const recentScores = [
  {
    id: 1,
    user: "张明",
    category: "创新贡献",
    description: "提出了新的算法公平性评估框架，该框架能够有效识别和减少AI系统中的偏见。",
    points: 15,
    date: "2023-06-15T10:30:00Z",
    comments: [],
    likes: ["李华"],
    objections: [],
  },
  {
    id: 2,
    user: "李华",
    category: "知识分享",
    description: "组织了AI伦理研讨会，邀请了行业专家分享最新的伦理准则和实践案例。",
    points: 10,
    date: "2023-06-12T15:45:00Z",
    comments: [],
    likes: ["张明", "王芳"],
    objections: [],
  },
  {
    id: 3,
    user: "当前用户",
    category: "团队协作",
    description: "协调多部门共同解决数据隐私问题，建立了跨部门协作机制。",
    points: 12,
    date: "2023-06-10T09:15:00Z",
    comments: [],
    likes: ["张明", "李华"],
    objections: [],
  },
]

