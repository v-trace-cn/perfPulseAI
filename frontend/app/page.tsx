import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "AI 治理系统 | 元宇宙科技",
  description: "下一代 AI 治理与激励机制",
}

export default function Home() {
  return <ClientPage />
}

