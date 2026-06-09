'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, FileText, BookOpen, GraduationCap } from 'lucide-react'
import { trainingPrograms, departments, majors } from '@/lib/mock-data'

export default function ApprovalManagementPage() {
  const [activeTab, setActiveTab] = useState<'program' | 'teaching-plan'>('program')
  const [programApprovals, setProgramApprovals] = useState(
    trainingPrograms
      .filter((p) => p.status === 'pending')
      .map((p) => ({ ...p, approvalStatus: 'pending' as const }))
  )

  const handleApprove = (id: string, type: 'program' | 'teaching-plan') => {
    if (type === 'program') {
      setProgramApprovals((prev) => prev.filter((p) => p.id !== id))
    }
    toast.success('已通过审批')
  }

  const handleReject = (id: string, type: 'program' | 'teaching-plan') => {
    if (type === 'program') {
      setProgramApprovals((prev) => prev.filter((p) => p.id !== id))
    }
    toast.success('已驳回审批')
  }

  const pendingPrograms = useMemo(() => {
    return programApprovals.map((p) => {
      const major = majors.find((m) => m.id === p.majorId)
      const dept = departments.find((d) => d.id === major?.departmentId)
      return { ...p, majorName: major?.name || '-', deptName: dept?.name || '-' }
    })
  }, [programApprovals])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">教学事务审批管理</h1>
        <p className="text-muted-foreground text-sm mt-1">
          对人培方案提交、教学计划提交审批进行审核
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'program' | 'teaching-plan')}>
        <TabsList>
          <TabsTrigger value="program">
            <BookOpen className="h-4 w-4 mr-1" />
            人培方案审批
            {pendingPrograms.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{pendingPrograms.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="teaching-plan">
            <GraduationCap className="h-4 w-4 mr-1" />
            教学计划审批
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'program' && (
        <Card>
          <CardContent className="pt-6">
            {pendingPrograms.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>暂无人培方案审批事项</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>方案名称</TableHead>
                    <TableHead>所属院系</TableHead>
                    <TableHead>专业</TableHead>
                    <TableHead>年级</TableHead>
                    <TableHead>提交人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPrograms.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.deptName}</TableCell>
                      <TableCell>{p.majorName}</TableCell>
                      <TableCell>{p.entryYear}级</TableCell>
                      <TableCell>{p.creator || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(p.id, 'program')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                            通过
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(p.id, 'program')}
                          >
                            <XCircle className="h-4 w-4 mr-1 text-red-600" />
                            驳回
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'teaching-plan' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-12">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>暂无教学计划审批事项</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
