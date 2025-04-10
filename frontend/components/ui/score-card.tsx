"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Bookmark, Flag, MessageSquare, Share2, ThumbsUp } from "lucide-react"
import { getRelativeTime } from "@/lib/utils"

interface ScoreCardProps {
  score: any
  avatar: any
  isLikedByCurrentUser: boolean
  isCurrentUserScore: boolean
  maxBonusReached: boolean
  hasObjections: boolean
  onLike: () => void
  onComment: () => void
  onObjection: () => void
  getCategoryIcon: (category: string) => React.ReactNode
}

export function ScoreCard({
  score,
  avatar,
  isLikedByCurrentUser,
  isCurrentUserScore,
  maxBonusReached,
  hasObjections,
  onLike,
  onComment,
  onObjection,
  getCategoryIcon,
}: ScoreCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        {/* 用户信息和时间 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={avatar.src} alt={score.user} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium mr-1">{score.user}</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                  <Award className="h-3 w-3 mr-1" />+{score.points}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs">
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
                    className="mr-1"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  +{score.likes?.length || 0}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-xs">
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
                    className="mr-1"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  +{Math.floor(score.points * 0.3)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <span>{avatar.department}</span>
                <span className="mx-1">•</span>
                <span>{getRelativeTime(score.date)}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            {getCategoryIcon(score.category)}
            <span className="ml-1">{score.category}</span>
          </Badge>
        </div>

        {/* 点赞详情 - 已移除，合并到按钮中 */}
        {/* {score.likes && score.likes.length > 0 && (
          <div className="px-4 py-2 bg-blue-50/50 dark:bg-blue-900/10 border-b text-xs">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">同事点赞 (+{score.likes.length})</p>
                <div className="flex flex-wrap gap-1">
                </div>
              </div>
              <div className="flex-1 ml-4">
                <p className="font-medium text-purple-700 dark:text-purple-400 mb-1">
                  领导点赞 (+{Math.floor(score.points * 0.3)})
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="outline"
                    className="bg-purple-100/50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] py-0 h-4"
                  >
                    王总监
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* 内容 */}
        <div className="p-4">
          <p className="text-sm">{score.description}</p>
        </div>

        {/* 互动区域 */}
        <div className="border-t p-2 bg-muted/10">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <Button
                variant={isLikedByCurrentUser ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 px-3 rounded-full ${isLikedByCurrentUser ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" : ""}`}
                onClick={onLike}
                disabled={maxBonusReached && !isLikedByCurrentUser}
                title={score.likes && score.likes.length > 0 ? `同事点赞: ${score.likes.join(", ")}` : "点赞"}
              >
                <ThumbsUp className={`h-3.5 w-3.5 mr-1.5 ${isLikedByCurrentUser ? "fill-current" : ""}`} />
                +1
              </Button>

              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full" onClick={onComment}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                {score.comments?.length > 0 ? score.comments.length : "评论"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full"
                onClick={onObjection}
                disabled={!isCurrentUserScore}
              >
                <Flag className="h-3.5 w-3.5 mr-1.5" />
                异议
              </Button>
            </div>

            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full">
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                分享
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                <Bookmark className="h-3.5 w-3.5" />
                <span className="sr-only">收藏</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

