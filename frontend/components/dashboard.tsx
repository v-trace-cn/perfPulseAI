"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentActivities } from "@/components/recent-activities"
// 修改导入方式，使用默认导入
import RewardSystem from "@/components/reward-system"
import { ScoringSystem } from "@/components/scoring-system"
import {
  Brain,
  BarChartIcon as ChartBar,
  Award,
  Gauge,
  Shield,
  Users,
  Cpu,
  User,
  Settings,
  Pencil,
  Trophy,
  Code,
  Layers,
  Paintbrush,
  BarChart,
  DollarSign,
  Scale,
  Mail,
  Phone,
  CheckCircle2,
  GitPullRequest,
  MessageSquare,
  Activity,
  Eye,
  EyeOff,
  Plus,
  Search,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"

// 添加自定义动画
const fadeInAnimation = `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`

const fadeInSlideUpAnimation = `@keyframes fadeInSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`

const pulseAnimation = `@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}`

// 添加全局样式
const globalStyles = `
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-fadeInSlideUp {
    animation: fadeInSlideUp 0.6s ease-out forwards;
  }
  
  .animate-pulse-subtle {
    animation: pulse 3s infinite;
  }
  
  .card-transition-delay-1 {
    animation-delay: 0.1s;
  }
  
  .card-transition-delay-2 {
    animation-delay: 0.2s;
  }
  
  .card-transition-delay-3 {
    animation-delay: 0.3s;
  }
  
  .card-transition-delay-4 {
    animation-delay: 0.4s;
  }

  .data-pill {
    display: inline-flex;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    line-height: 1rem;
    align-items: center;
    justify-content: center;
  }

  .toggle {
    --width: 32px;
    --height: calc(var(--width) / 2);
    --radius: var(--height);
    --handle-bg: #fff;
    --handle-offset: 2px;
    --bg: theme(colors.primary.DEFAULT);
    --bg-empty: theme(colors.muted.DEFAULT);
    --transition: 0.2s ease;
    
    position: relative;
    display: inline-block;
    width: var(--width);
    height: var(--height);
    cursor: pointer;
    
    &:after {
      content: '';
      position: absolute;
      top: var(--handle-offset);
      left: var(--handle-offset);
      width: calc(var(--height) - (var(--handle-offset) * 2));
      height: calc(var(--height) - (var(--handle-offset) * 2));
      border-radius: 50%;
      background: var(--handle-bg);
      transition: left var(--transition);
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: var(--radius);
      background: var(--bg-empty);
      transition: background var(--transition);
    }
    
    &:checked {
      &:before {
        background: var(--bg);
      }
      
      &:after {
        left: calc(100% - var(--height) + var(--handle-offset) + 2px);
      }
    }
  }

  .select {
    appearance: none;
    background-color: transparent;
    border: 1px solid theme(colors.muted.DEFAULT);
    border-radius: theme(borderRadius.md);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: theme(colors.foreground.DEFAULT);
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: theme(colors.primary.DEFAULT);
      box-shadow: 0 0 0 2px rgba(theme(colors.primary.DEFAULT), 0.2);
    }
    
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .select-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
`

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [userData, setUserData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    position: user?.position || "",
    email: user?.email || "",
    phone: user?.phone || "",
    joinDate: user?.joinDate || "",
    points: user?.points || 0,
    level: user?.level || 0,
    avatar: user?.avatar || "/placeholder.svg?height=128&width=128",
    skills: user?.skills || [],
    achievements: [
      { id: 1, title: "AI算法优化奖", date: "2023-Q2", icon: "🧠" },
      { id: 2, title: "数据安全贡献奖", date: "2023-05", icon: "🔒" },
      { id: 3, title: "最佳团队协作奖", date: "2023-07", icon: "🤝" },
    ],
    recentActivities: [
      { id: 1, type: "task", title: "完成算法偏见检测", date: "2023-08-15", points: 15 },
      { id: 2, type: "contribution", title: "提交代码优化方案", date: "2023-08-10", points: 20 },
      { id: 3, type: "review", title: "参与伦理审查会议", date: "2023-08-05", points: 10 },
    ],
  })

  const [showPhone, setShowPhone] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [viewColleagueOpen, setViewColleagueOpen] = useState(false)
  const [selectedColleague, setSelectedColleague] = useState<any>(null)

  const [teamMembers] = useState([
    {
      id: 1,
      name: "李华",
      department: "数据部",
      position: "数据科学家",
      email: "lihua@example.com",
      phone: "139****4567",
      joinDate: "2022-01-10",
      points: 1320,
      level: 3,
      avatar: "/placeholder.svg?height=128&width=128",
      skills: ["数据挖掘", "机器学习", "Python", "数据可视化", "统计分析"],
    },
    {
      id: 2,
      name: "王芳",
      department: "伦理部",
      position: "伦理专家",
      email: "wangfang@example.com",
      phone: "135****7890",
      joinDate: "2021-08-15",
      points: 1580,
      level: 4,
      avatar: "/placeholder.svg?height=128&width=128",
      skills: ["AI伦理", "政策分析", "风险评估", "合规审查", "伦理框架"],
    },
  ])

  const [teamMemberSearch, setTeamMemberSearch] = useState("")

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以添加保存逻辑，例如API调用
    setEditProfileOpen(false)

    // 显示一个简单的成功消息
    alert("个人资料已更新")
  }

  useEffect(() => {
    // 检查 URL 参数是否包含 tab=profile
    const tab = searchParams.get("tab")
    if (tab === "profile") {
      setActiveTab("profile")
    }
  }, [searchParams])

  return (
    <div className="flex flex-col min-h-screen w-full">
      <style jsx global>{`
        ${fadeInAnimation}
        ${fadeInSlideUpAnimation}
        ${pulseAnimation}
        ${globalStyles}
      `}</style>
      <div className="w-full bg-background/95 backdrop-blur-md sticky top-0 z-10 border-b border-primary/10 shadow-sm transition-all duration-300 animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-2 group">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full transition-all duration-500 group-hover:h-10 group-hover:bg-gradient-to-b group-hover:from-accent group-hover:to-primary"></div>
              <h2 className="text-lg font-semibold cyber-text relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-500 group-hover:after:w-full">
                控制台
              </h2>
            </div>

            <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab} className="flex-1 ml-8">
              <TabsList className="flex justify-center bg-muted/10 backdrop-blur-sm rounded-full border border-primary/5 p-1 shadow-inner">
                <TabsTrigger
                  value="overview"
                  className="flex items-center px-4 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 hover:bg-muted/30 relative overflow-hidden after:absolute after:inset-0 after:opacity-0 after:bg-gradient-to-r after:from-primary/10 after:to-transparent after:transition-opacity after:duration-500 hover:after:opacity-100"
                >
                  <Gauge className="mr-2 h-4 w-4" />
                  <span>智能概览</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rewards"
                  className="flex items-center px-4 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 hover:bg-muted/30 relative overflow-hidden after:absolute after:inset-0 after:opacity-0 after:bg-gradient-to-r after:from-primary/10 after:to-transparent after:transition-opacity after:duration-500 hover:after:opacity-100"
                >
                  <Award className="mr-2 h-4 w-4" />
                  <span>积分系统</span>
                </TabsTrigger>
                <TabsTrigger
                  value="scoring"
                  className="flex items-center px-4 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 hover:bg-muted/30 relative overflow-hidden after:absolute after:inset-0 after:opacity-0 after:bg-gradient-to-r after:from-primary/10 after:to-transparent after:transition-opacity after:duration-500 hover:after:opacity-100"
                >
                  <ChartBar className="mr-2 h-4 w-4" />
                  <span>治理机制</span>
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="flex items-center px-4 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 hover:bg-muted/30 relative overflow-hidden after:absolute after:inset-0 after:opacity-0 after:bg-gradient-to-r after:from-primary/10 after:to-transparent after:transition-opacity after:duration-500 hover:after:opacity-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>个人中心</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <main className="space-y-8 max-w-7xl mx-auto flex-grow w-full">

        {activeTab === "overview" && (
          <section className="space-y-8 pt-4 animate-fadeIn transition-opacity duration-300">
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto px-2">
              <Card className="tech-card overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp card-transition-delay-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-transparent">
                  <CardTitle className="text-sm font-medium">治理指数</CardTitle>
                  <div className="p-2 rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">89.5</div>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full progress-indicator" style={{ width: "89.5%" }}></div>
                    </div>
                    <span className="ml-2 text-xs text-green-400">+2.5%</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="tech-card overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp card-transition-delay-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-secondary/10 to-transparent">
                  <CardTitle className="text-sm font-medium">智能任务</CardTitle>
                  <div className="p-2 rounded-full bg-secondary/10">
                    <Brain className="h-5 w-5 text-secondary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">145</div>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full progress-indicator" style={{ width: "72.5%" }}></div>
                    </div>
                    <span className="ml-2 text-xs text-green-400">+24</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="tech-card overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp card-transition-delay-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-accent/10 to-transparent">
                  <CardTitle className="text-sm font-medium">积分总数</CardTitle>
                  <div className="p-2 rounded-full bg-accent/10">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{userData?.points || 0}</div>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full progress-indicator" style={{ width: "62.5%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="flex items-center">
                      <Users className="h-3.5 w-3.5 text-purple-500 mr-1" />
                      团队加分: <span className="text-purple-500 font-medium ml-1">+28</span>
                    </span>
                    <span className="text-muted-foreground">本周新增</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="tech-card overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp card-transition-delay-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-500/10 to-transparent">
                  <CardTitle className="text-sm font-medium">合规状态</CardTitle>
                  <div className="p-2 rounded-full bg-red-500/10">
                    <Cpu className="h-5 w-5 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">98.2%</div>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: "98.2%" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-green-400">+1.2%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="flex items-center">
                      <Shield className="h-3.5 w-3.5 text-green-500 mr-1" />
                      <span>
                        最近检测: <span className="text-green-500 font-medium">通过</span>
                      </span>
                    </span>
                    <span className="text-muted-foreground">今日</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-7 max-w-7xl mx-auto px-2">
              <Card className="col-span-4 tech-card shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp">
                <CardHeader>
                  <CardTitle>多维度治理分析</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3 tech-card shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp">
                <CardHeader>
                  <CardTitle>最近活动</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentActivities />
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {activeTab === "rewards" && (
          <section className="animate-fadeIn transition-opacity duration-300 p-4">
            <div className="bg-card rounded-xl border border-border shadow-lg p-6">
              <RewardSystem />
            </div>
          </section>
        )}

        {activeTab === "scoring" && (
          <section className="animate-fadeIn transition-opacity duration-300 p-2 md:p-3 lg:p-4">
            <div className="bg-card rounded-xl border border-border shadow-lg p-4 md:p-5 lg:p-6 w-full max-w-[1400px] mx-auto">
              <ScoringSystem />
            </div>
          </section>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6 pt-4 animate-fadeIn transition-opacity duration-300 max-w-7xl mx-auto px-2">
            <div className="grid gap-6 md:grid-cols-3">
              {/* 个人信息卡片 */}
              <Card className="tech-card shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp md:col-span-1">
                <CardHeader className="flex flex-col items-center text-center pb-2 bg-gradient-to-r from-primary/10 to-transparent rounded-t-xl overflow-hidden">
                  <div className="relative mb-2">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {userData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                      <Cpu className="h-4 w-4" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{userData.name}</CardTitle>
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                      {userData.department} · {userData.position}
                    </Badge>
                    <p className="text-sm text-muted-foreground">加入时间: {userData.joinDate}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">联系方式</h4>
                      </div>
                      <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{userData.email}</span>
                      </div>
                      <div className="grid grid-cols-[20px_1fr_auto] gap-2 items-center">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm transition-all duration-300">
                          {showPhone ? (
                            <span className="text-foreground font-medium">{userData.phone}</span>
                          ) : (
                            <span className="text-muted-foreground">
                              {userData.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => setShowPhone(!showPhone)}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                        >
                          {showPhone ? (
                            <>
                              <EyeOff className="h-3 w-3" />
                              <span>隐藏手机号</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" />
                              <span>显示手机号</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">积分等级</h4>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <div className="text-lg font-bold">{userData.points}</div>
                        <Badge className="ml-auto bg-primary/10 text-primary">Lv.{userData.level}</Badge>
                      </div>
                      <Progress
                        value={(userData.points / 2000) * 100}
                        className="h-2 bg-muted/50"
                        indicatorClassName="progress-indicator"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        距离下一级别还需 <span className="text-primary">{2000 - userData.points}</span> 积分
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">专业技能</h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-muted/30 pr-1 pl-2 flex items-center gap-1 group"
                          >
                            {skill}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setUserData({
                                  ...userData,
                                  skills: userData.skills.filter((_, i) => i !== index),
                                })
                              }}
                              className="rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-x"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </button>
                          </Badge>
                        ))}
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => {
                            const newSkill = prompt("请输入要添加的技能")
                            if (newSkill && newSkill.trim() !== "") {
                              setUserData({
                                ...userData,
                                skills: [...userData.skills, newSkill.trim()],
                              })
                            }
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-primary to-accent border-0"
                      onClick={() => setEditProfileOpen(true)}
                    >
                      编辑个人资料
                    </Button>

                    <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>编辑个人资料</DialogTitle>
                          <DialogDescription>更新您的个人信息和偏好设置</DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault()
                            
                            // 获取表单数据
                            const formData = new FormData(e.currentTarget)
                            const name = formData.get('edit-name') as string
                            const department = formData.get('edit-department') as string
                            const position = formData.get('edit-position') as string
                            const email = formData.get('edit-email') as string
                            const phone = formData.get('edit-phone') as string
                            
                            try {
                              // 调用Next.js API路由更新用户信息
                              if (user?.id) {
                                const response = await fetch(`/api/users/${user.id}/updateInfo`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    name,
                                    department,
                                    position,
                                    email,
                                    phone
                                  }),
                                });
                                
                                const result = await response.json();
                                
                                if (result.success) {
                                  // 更新本地用户数据
                                  const updatedUserData = {
                                    ...userData,
                                    name,
                                    department,
                                    position,
                                    email,
                                    phone
                                  };
                                  setUserData(updatedUserData);
                                  
                                  // 同时更新全局用户上下文
                                  if (user) {
                                    const updatedUser = {
                                      ...user,
                                      name,
                                      department,
                                      position,
                                      email,
                                      phone
                                    };
                                    // 使用auth上下文中的setUser函数更新全局用户状态
                                    setUser(updatedUser);
                                  }
                                  
                                  alert("个人资料已成功更新");
                                } else {
                                  alert(`更新失败: ${result.message}`);
                                }
                              }
                            } catch (error) {
                              console.error('更新用户信息时出错:', error);
                              alert('更新用户信息时出错，请重试');
                            }
                            
                            setEditProfileOpen(false)
                          }}
                        >
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                姓名
                              </Label>
                              <Input id="edit-name" name="edit-name" defaultValue={User.name} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-department" className="text-right">
                                部门
                              </Label>
                              <Input id="edit-department" name="edit-department" defaultValue={userData.department} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-position" className="text-right">
                                职位
                              </Label>
                              <Input id="edit-position" name="edit-position" defaultValue={userData.position} className="col-span-3" />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">
                                邮箱
                              </Label>
                              <Input id="edit-email" name="edit-email" defaultValue={userData.email} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-phone" className="text-right">
                                手机
                              </Label>
                              <Input id="edit-phone" name="edit-phone" defaultValue={userData.phone} className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-accent border-0">
                              保存更改
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* 成就和活动卡片 */}
              <Card className="tech-card shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp md:col-span-2">
                <CardHeader>
                  <CardTitle>个人成就与活动</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="achievements" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/30 backdrop-blur-sm rounded-lg shadow-sm">
                      <TabsTrigger
                        value="achievements"
                        className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-8 rounded-md"
                      >
                        <Trophy className="mr-2 h-3.5 w-3.5" />
                        <span>成就徽章</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="activities"
                        className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-8 rounded-md"
                      >
                        <Activity className="mr-2 h-3.5 w-3.5" />
                        <span>最近活动</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="achievements" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {userData.achievements.map((achievement) => (
                          <Card key={achievement.id} className="tech-card overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-md font-medium">{achievement.title}</CardTitle>
                              <div className="text-2xl">{achievement.icon}</div>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <p className="text-sm text-muted-foreground">{achievement.date}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="activities" className="space-y-4">
                      <div className="space-y-4">
                        {userData.recentActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors duration-300"
                          >
                            <div className="relative">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                {activity.type === "task" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {activity.type === "contribution" && (
                                  <GitPullRequest className="h-4 w-4 text-blue-500" />
                                )}
                                {activity.type === "review" && <MessageSquare className="h-4 w-4 text-purple-500" />}
                              </div>
                            </div>
                            <div className="ml-4 space-y-1 flex-1">
                              <p className="text-sm font-medium leading-none">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                            <div className="ml-auto font-medium">
                              <div className="data-pill bg-primary/10 text-primary shadow-sm">
                                +{activity.points} 积分
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              {/* 团队成员卡片 */}
              <Card className="tech-card shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px] animate-fadeInSlideUp md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>团队成员</CardTitle>
                  <div className="relative w-64">
                    <Input
                      type="text"
                      placeholder="搜索成员..."
                      value={teamMemberSearch}
                      onChange={(e) => setTeamMemberSearch(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {teamMembers
                      .filter(
                        (member) =>
                          teamMemberSearch === "" ||
                          member.name.toLowerCase().includes(teamMemberSearch.toLowerCase()) ||
                          member.department.toLowerCase().includes(teamMemberSearch.toLowerCase()) ||
                          member.position.toLowerCase().includes(teamMemberSearch.toLowerCase()),
                      )
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex flex-col items-center p-4 rounded-lg border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedColleague(member)
                            setViewColleagueOpen(true)
                          }}
                        >
                          <Avatar className="h-16 w-16 mb-2 border-2 border-primary/20">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-center">{member.name}</h3>
                          <p className="text-xs text-muted-foreground text-center">
                            {member.department} · {member.position}
                          </p>
                          <Badge className="mt-2 bg-primary/10 text-primary border-none">
                            Lv.{member.level} · {member.points}分
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      {/* 查看同事资料对话框 */}
      <Dialog open={viewColleagueOpen} onOpenChange={setViewColleagueOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>同事资料</DialogTitle>
            <DialogDescription>查看团队成员的详细信息</DialogDescription>
          </DialogHeader>
          {selectedColleague && (
            <div className="py-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 mb-2 border-4 border-primary/20">
                  <AvatarImage src={selectedColleague.avatar} alt={selectedColleague.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedColleague.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{selectedColleague.name}</h2>
                <Badge className="mt-1 bg-primary/10 text-primary border-none">
                  {selectedColleague.department} · {selectedColleague.position}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">联系方式</h4>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedColleague.email}</span>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedColleague.phone}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">积分等级</h4>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div className="text-lg font-bold">{selectedColleague.points}</div>
                    <Badge className="ml-auto bg-primary/10 text-primary">Lv.{selectedColleague.level}</Badge>
                  </div>
                  <Progress
                    value={(selectedColleague.points / 2000) * 100}
                    className="h-2 bg-muted/50"
                    indicatorClassName="progress-indicator"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">专业技能</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedColleague.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-4">加入时间: {selectedColleague.joinDate}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewColleagueOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
