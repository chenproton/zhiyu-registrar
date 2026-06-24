import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Info } from "lucide-react"

export default function CourseClosePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          结课确认
        </h1>
        <p className="text-muted-foreground mt-1">
          学期末确认教学班数据完整性，提交结课申请，由院系及教务处审核后正式关闭本学期教学班。
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
          <p>该模块对应教学业务流程「阶段 8：结课、教学归档、资源复用」的结课确认环节。</p>
          <p>具体页面内容（待结课班级、结课 checklist、审核状态等）将在后续按业务原型补充。</p>
        </CardContent>
      </Card>
    </div>
  )
}
