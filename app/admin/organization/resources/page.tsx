'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil } from 'lucide-react'
import { textbooks, venues } from '@/lib/mock-data'

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">教学资源管理</h1>
          <p className="text-muted-foreground">管理教材库与场地资源</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建资源</Button>
      </div>

      <Tabs defaultValue="textbooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="textbooks">教材库</TabsTrigger>
          <TabsTrigger value="venues">场地资源</TabsTrigger>
        </TabsList>

        <TabsContent value="textbooks" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>教材名称</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>出版社</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>版次</TableHead>
                    <TableHead>关联课程</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {textbooks.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.isbn}</TableCell>
                      <TableCell>{t.publisher}</TableCell>
                      <TableCell>{t.author}</TableCell>
                      <TableCell>{t.edition}</TableCell>
                      <TableCell>{t.associatedCourses.join(', ')}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>
                          {t.status === 'active' ? '启用' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>场地名称</TableHead>
                    <TableHead>场地类型</TableHead>
                    <TableHead>容纳人数</TableHead>
                    <TableHead>所在位置</TableHead>
                    <TableHead>设施设备</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>{v.type}</TableCell>
                      <TableCell>{v.capacity}</TableCell>
                      <TableCell>{v.location}</TableCell>
                      <TableCell>{v.facilities}</TableCell>
                      <TableCell>
                        <Badge variant={v.status === 'available' ? 'default' : v.status === 'maintenance' ? 'secondary' : 'destructive'}>
                          {v.status === 'available' ? '可用' : v.status === 'maintenance' ? '维修中' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
