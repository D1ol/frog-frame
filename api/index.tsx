import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { serveStatic } from 'frog/serve-static'
import { handle } from 'frog/vercel'
import type { Address } from 'viem'
import { baseSepolia } from 'viem/chains'
import { abi } from '../abi.js'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
    basePath: '/api',
    // Supply a Hub API URL to enable frame verification.
    hub: pinata(),
    // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
})

app.frame('/', (c) => {
    return c.res({
        action: '/finish',
        image: (
            <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
                Perform a transaction
            </div>
        ),
        intents: [<Button.Transaction target="/mint">Mint</Button.Transaction>],
    })
})

app.frame('/finish', (c) => {
    const { transactionId } = c
    return c.res({
        image: (
            <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
                Transaction ID: {transactionId}
            </div>
        ),
    })
})

app.transaction('/mint', (c) => {
    const address = c.address as Address

    console.log('address', address)
    return c.contract({
        abi,
        functionName: 'mint',
        args: [
           1
        ],
        chainId: `eip155:${baseSepolia.id}`,
        to: '0x9cbbf4ad5f0ea1ec7a434a140a7724f4fdb2776d',
    })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)