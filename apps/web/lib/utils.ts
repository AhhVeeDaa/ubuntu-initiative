// Ubuntu Initiative Helper Functions

// Launch date of Phase 0
export const PHASE_0_LAUNCH_DATE = new Date('2026-01-01')

/**
 * Calculate days since Phase 0 launch
 */
export function getDaysSinceLaunch(): number {
  const now = new Date()
  const diff = now.getTime() - PHASE_0_LAUNCH_DATE.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Calculate Phase 0 progress percentage
 */
export function calculatePhase0Progress(milestones: any[]): number {
  if (!milestones || milestones.length === 0) return 0
  
  const phase0Milestones = milestones.filter(m => m.phase === 'phase_0')
  if (phase0Milestones.length === 0) return 0
  
  const totalProgress = phase0Milestones.reduce((sum, m) => sum + (m.progress || 0), 0)
  return Math.round(totalProgress / phase0Milestones.length)
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return formatDate(date)
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'completed': 'text-green-500',
    'in_progress': 'text-blue-500',
    'not_started': 'text-gray-500',
    'blocked': 'text-red-500',
  }
  return colors[status] || 'text-gray-500'
}

/**
 * Get category icon
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'legal': '⚖️ Legal',
    'feasibility': '📊 Feasibility',
    'partnerships': '🤝 Partnerships',
    'funding': '💰 Funding',
    'operational': '⚙️ Operational'
  }
  return labels[category] || category
}
