'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'
import { authClient } from '@/lib/auth-client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  ArrowLeft,
  Users,
  DollarSign,
  Image,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Calendar,
  Zap,
  Crown,
  Package,
} from 'lucide-react'

type UserData = {
  id: string
  name: string
  email: string
  image?: string | null
  createdAt: string | Date
  role?: string | null
}

export default function AdminPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const router = useRouter()
  const stats = useQuery(api.admin.getStats)
  const [users, setUsers] = useState<UserData[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [usersLoading, setUsersLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  // Check admin status
  useEffect(() => {
    if (sessionPending) return
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    // Check role via session
    const user = session.user as { role?: string }
    if (user.role === 'admin') {
      setIsAdmin(true)
    } else {
      // Also check via adminUserIds — the session might not have role yet
      // We'll try to list users; if it fails, they're not admin
      setIsAdmin(true) // Optimistic, will fail gracefully
    }
  }, [session, sessionPending, router])

  // Fetch users via Better Auth admin API
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true)
      const res = await authClient.admin.listUsers({
        query: {
          limit: 100,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        },
      })
      if (res?.data) {
        setUsers(res.data.users as UserData[])
        setTotalUsers(res.data.total ?? res.data.users.length)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setIsAdmin(false)
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin, fetchUsers])

  // Loading state
  if (sessionPending || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not admin
  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <ShieldCheck className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const formatCurrency = (dollars: number) => {
    return `$${dollars.toFixed(2)}`
  }

  const formatDate = (timestamp: number | string | Date) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (timestamp: number | string | Date) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const now = new Date()
  const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000
  const oneWeekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000
  const newUsersToday = users.filter((u) => new Date(u.createdAt).getTime() >= oneDayAgo).length
  const newUsersThisWeek = users.filter((u) => new Date(u.createdAt).getTime() >= oneWeekAgo).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={totalUsers.toString()}
            sub={`${newUsersToday} today, ${newUsersThisWeek} this week`}
            color="primary"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={stats ? formatCurrency(stats.totalRevenue) : '...'}
            sub={stats ? `${formatCurrency(stats.revenueThisWeek)} this week` : ''}
            color="emerald"
          />
          <StatCard
            icon={Image}
            label="Infographics Made"
            value={stats ? stats.totalCreditsUsed.toString() : '...'}
            sub="credits consumed"
            color="violet"
          />
          <StatCard
            icon={CreditCard}
            label="Purchases"
            value={stats ? stats.totalPurchases.toString() : '...'}
            sub={stats ? `${stats.uniquePayingUsers} paying users` : ''}
            color="amber"
          />
        </div>

        {/* Secondary Stats */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniStat label="Revenue Today" value={formatCurrency(stats.revenueToday)} />
            <MiniStat label="Revenue This Month" value={formatCurrency(stats.revenueThisMonth)} />
            <MiniStat label="Credits Remaining" value={stats.totalCreditsRemaining.toString()} />
            <MiniStat label="Credits Sold" value={stats.totalCreditsSold.toString()} />
          </div>
        )}

        {/* Plan Breakdown + Recent Purchases */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Plan Breakdown */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <Package className="h-4 w-4 text-muted-foreground" />
              Revenue by Plan
            </h2>
            {stats && Object.keys(stats.revenueByPlan).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.revenueByPlan).map(([plan, data]) => (
                  <div key={plan} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                          plan === 'popular'
                            ? 'bg-primary/15 text-primary'
                            : plan === 'pro'
                              ? 'bg-amber-500/15 text-amber-600'
                              : plan === 'starter'
                                ? 'bg-teal-500/15 text-teal-600'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {plan === 'popular' ? (
                          <Crown className="h-4 w-4" />
                        ) : plan === 'pro' ? (
                          <Zap className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize">{plan}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.count} purchase{data.count !== 1 ? 's' : ''} &middot; {data.credits} credits
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(data.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No purchases yet.</p>
            )}
          </div>

          {/* Recent Purchases */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Recent Purchases
            </h2>
            {stats && stats.recentPurchases.length > 0 ? (
              <div className="space-y-2">
                {stats.recentPurchases.slice(0, 8).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
                        {p.userId.slice(0, 12)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="capitalize font-medium text-foreground">{p.plan}</span> &middot;{' '}
                        {p.credits} credits
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(p.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No purchases yet.</p>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8 rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Users className="h-4 w-4 text-muted-foreground" />
              Users ({totalUsers})
            </h2>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Role</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users.map((user) => (
                    <tr key={user.id} className="group">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt=""
                              className="h-7 w-7 rounded-full"
                            />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                          <span className="font-medium">{user.name || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 pr-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">User</span>
                        )}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>
          )}
        </div>
      </main>
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof Users
  label: string
  value: string
  sub: string
  color: 'primary' | 'emerald' | 'violet' | 'amber'
}) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

// Mini Stat Component
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold">{value}</p>
    </div>
  )
}
