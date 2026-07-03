'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowRight } from 'lucide-react'

export default function ResourcesPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin/operations/scheduling')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            场地资源管理已迁移
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            场地资源管理功能已统一迁移至<strong>排课工作台</strong>的“场地节次对齐”步骤中。
            您可以在导入课表前，完成场地维护、Excel 场地/节次映射等操作。
          </p>
          <p className="text-xs text-muted-foreground">
            3 秒后自动跳转，或点击下方按钮立即进入。
          </p>
          <Button className="w-full gap-2" onClick={() => router.push('/admin/operations/scheduling')}>
            前往排课工作台
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
