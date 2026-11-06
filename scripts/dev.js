// Starts everything local development needs with one command: `npm run dev`.
// 1. Docker (starts Colima when Docker is not running and Colima is installed)
// 2. Postgres from docker-compose, then the schema migration (safe to repeat)
// 3. The catalogue API (`npm run server`) and the Vite site (`npm run dev:site`), side by side
// Steps 1–2 are skipped when DATABASE_URL points at a hosted database. Ctrl+C stops both servers;
// Postgres keeps running in the background (`docker compose stop` stops it).
import { execSync, spawn } from 'node:child_process'
import process from 'node:process'

const API_PORT = Number(process.env.PORT ?? 3001)
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1']

const step = (message) => console.log(`\n\x1b[2m›\x1b[0m ${message}`)

const fail = (message) => {
  console.error(`\n\x1b[31m✗\x1b[0m ${message}\n`)
  process.exit(1)
}

const run = (command) => {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch {
    fail(`\`${command}\` failed (see above).`)
  }
}

const succeeds = (command) => {
  try {
    execSync(command, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function usesLocalDatabase() {
  if (!process.env.DATABASE_URL) {
    fail('DATABASE_URL is not set. Copy the values from .env.example into .env.local.')
  }
  return LOCAL_HOSTS.includes(new URL(process.env.DATABASE_URL).hostname)
}

function ensureDocker() {
  if (succeeds('docker info')) return
  if (!succeeds('command -v colima')) {
    fail('Docker is not running. Start Docker, then run `npm run dev` again.')
  }
  step('Starting Docker (Colima)…')
  run('colima start')
}

/** A server left running (say, from another terminal) would make the new one fail to start. */
async function ensureApiPortFree() {
  const inUse = await fetch(`http://localhost:${API_PORT}/api/admin/session`)
    .then(() => true)
    .catch(() => false)
  if (inUse) {
    fail(`Something is already running on port ${API_PORT} (probably the API). Stop it first.`)
  }
}

/** Runs an npm script, prefixing each output line so the two servers' logs stay apart. */
function start(script, label, color) {
  const child = spawn('npm', ['run', '--silent', script], {
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['inherit', 'pipe', 'pipe'],
  })
  const prefix = `\x1b[${color}m${label.padEnd(4)}│\x1b[0m `
  const forward = (target) => (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim()) target.write(`${prefix}${line}\n`)
    }
  }
  child.stdout.on('data', forward(process.stdout))
  child.stderr.on('data', forward(process.stderr))
  return child
}

if (usesLocalDatabase()) {
  ensureDocker()
  step('Starting Postgres…')
  run('npm run --silent db:up')
  step('Updating the database schema…')
  run('npm run --silent db:migrate')
}
await ensureApiPortFree()

step('Starting the API and the site. Press Ctrl+C to stop both.\n')
const children = [start('server', 'api', 35), start('dev:site', 'site', 36)]

// When either server stops (or Ctrl+C), stop the other too.
let stopping = false
const stopAll = (code) => {
  if (stopping) return
  stopping = true
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM')
  process.exitCode = code
}
for (const child of children) child.on('exit', (code) => stopAll(code ?? 0))
process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))
