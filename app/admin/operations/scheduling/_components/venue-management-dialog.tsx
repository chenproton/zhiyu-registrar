'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import VenueManager, { type VenueManagerState } from '@/components/shared/venue-manager'
import { venues as mockVenues, venueTypes as mockVenueTypes, type Venue } from '@/lib/mock-data'

interface VenueManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venues: Venue[]
  venueTypes: string[]
  onChange: (state: VenueManagerState) => void
}

export default function VenueManagementDialog({
  open,
  onOpenChange,
  venues,
  venueTypes,
  onChange,
}: VenueManagementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>场地资源管理</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto pr-2">
          <VenueManager
            initialVenues={venues.length ? venues : mockVenues}
            initialVenueTypes={venueTypes.length ? venueTypes : mockVenueTypes}
            onChange={onChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
