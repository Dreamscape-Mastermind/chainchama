/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hUkwilBeRcB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Separator } from "~~/components/ui/separator"
import { Badge } from "~~/components/ui/badge"

export default function Details() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">ChainChama</h1>
            <p className="text-muted-foreground">A community-based savings and investment group</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Contributions</h3>
              <p className="text-4xl font-bold">$25,000</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Current Recipient</h3>
              <p className="text-4xl font-bold">Jane Doe</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Status</h3>
              <p className="text-4xl font-bold">Active</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Contribution per Member</h3>
              <p className="text-4xl font-bold">$100</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">About ChainChama</h2>
            <p className="text-muted-foreground">
              The ChainChama is a community-based savings and investment group that helps members achieve their
              financial goals through regular contributions and collective investments. The group is committed to
              promoting financial literacy and empowering its members to build wealth over time.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Contribution Timeline</h2>
            <div className="bg-card p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">January 2023</div>
                <div className="font-bold">$100</div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">February 2023</div>
                <div className="font-bold">$100</div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">March 2023</div>
                <div className="font-bold">$100</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Savings Rate</h2>
            <div className="bg-card p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Savings Rate</div>
                <div className="font-bold">8%</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Allowed Tokens</h2>
            <div className="bg-card p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">USDC</Badge>
                <Badge variant="secondary">DAI</Badge>
                <Badge variant="secondary">BUSD</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-card p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <div className="grid gap-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Reputation</div>
                <div className="font-bold">25</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Chamas</div>
                <div className="font-bold">3</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Profile ID</div>
                <div className="font-bold">ABC123</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Wallet Address</div>
                <Link href="#" className="font-bold underline" prefetch={false}>
                  0x123...456
                </Link>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Join Date</div>
                <div className="font-bold">January 2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}