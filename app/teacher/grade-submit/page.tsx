import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Info } from "lucide-react"

export default function GradeSubmitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          成绩确认与提交
        </h1>
        <p className="text-muted-foreground mt-1">
          接收课程平台回传的线上过程成绩，录入线下实训、课堂表现及期末成绩，确认后提交教务合成总评成绩。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            功能说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>该模块对应教学业务流程「阶段 7：过程数据回传 + 期末总成绩核算」的教师侧操作。</p>
          <p>具体页面内容（班级列表、成绩录入表、提交审核流等）将在后续按业务原型补充。</p>
        </CardContent>
      </Card>
    </div>
  )
}
