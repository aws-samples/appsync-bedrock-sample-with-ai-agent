/* eslint-disable */
import { build } from 'esbuild'
import {glob} from 'glob'

// Build agent api
const files_agent = await glob('lib/agent-api/functions/**/*.ts')
console.log(`Building ${files_agent.length} files from agent-api`)

await build({
	sourcesContent: false,
	format: 'esm',
	target: 'esnext',
	platform: 'node',
	external: ['@aws-appsync/utils'],
	outdir: 'lib/agent-api/functions-js',
	entryPoints: files_agent,
	bundle: true,
})

// Build car dealer example
const files_car_dealer = await glob('lib/example-action-apis/functions/**/*.ts')
console.log(`Building ${files_car_dealer.length} files from car-dealer example`)

await build({
	sourcesContent: false,
	format: 'esm',
	target: 'esnext',
	platform: 'node',
	external: ['@aws-appsync/utils'],
	outdir: 'lib/example-action-apis/functions-js',
	entryPoints: files_car_dealer,
	bundle: true,
})
