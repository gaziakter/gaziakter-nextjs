import { FLOWS, Flow } from './flowData'

export function matchFlow(input: string): Flow {
  const q = input.toLowerCase().trim()

  // Direct id match
  const direct = FLOWS.find(f => f.id === q)
  if (direct) return direct

  // Trigger keyword match
  for (const flow of FLOWS) {
    if (!flow.triggers) continue
    if (flow.triggers.some(t => q.includes(t) || t === q)) return flow
  }

  // Fuzzy match
  for (const flow of FLOWS) {
    if (!flow.triggers) continue
    if (flow.triggers.some(t => t.split(' ').some(w => w.length > 3 && q.includes(w)))) return flow
  }

  return FLOWS.find(f => f.id === 'error')!
}
