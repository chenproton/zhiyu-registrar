import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Info } from "lucide-react"

export default function TeacherArchivePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          教学资料归档
        </h1>
        <p className="text-muted-foreground mt-1">
          归档本学期教学资料、教案、过程数据及成绩台账，形成可追溯的教学档案。
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
          <p>该模块对应教学业务流程「阶段 8：结课、教学归档、资源复用」的教师归档环节。</p>
          <p>具体页面内容（归档清单、资料上传、档案袋预览等）将在后续按业务原型补充。</p>
        </CardContent>
      </Card>
    </div>
  )
}
