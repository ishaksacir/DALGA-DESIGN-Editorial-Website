import { INVENTORY } from '../inventory/inventory'

const byArea = new Map<string, number>()
const byPriority = new Map<string, number>()
for (const i of INVENTORY) {
  byArea.set(i.area, (byArea.get(i.area) ?? 0) + 1)
  byPriority.set(i.priority, (byPriority.get(i.priority) ?? 0) + 1)
}
console.log(`${INVENTORY.length} inventory items`)
console.log('By area:', Object.fromEntries(byArea))
console.log('By priority:', Object.fromEntries(byPriority))
for (const i of INVENTORY)
  console.log(`${i.id.padEnd(26)} ${i.priority.padEnd(9)} ${i.area.padEnd(11)} ${i.title}`)
