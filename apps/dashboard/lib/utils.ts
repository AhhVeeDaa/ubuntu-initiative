
export function getDaysSinceLaunch() {
    const launchDate = new Date('2026-01-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - launchDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function calculatePhase0Progress(milestones: Record<string, any>[]) {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / milestones.length) * 100);
}
