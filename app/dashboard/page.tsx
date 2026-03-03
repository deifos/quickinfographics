'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from '@/lib/auth-client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Zap,
  ArrowRight,
  Loader2,
  Download,
  Trash2,
  Sparkles,
  RectangleVertical,
  Square,
  RectangleHorizontal,
  Video,
  Image,
  Check,
  X,
  LogOut,
  Play,
  CreditCard,
  Crown,
  ChevronRight,
  AlertCircle,
  Palette,
  PenTool,
  Minus,
  Box,
  Layers,
  CircleDot,
  Shield,
} from 'lucide-react'
import { saveInfographic, getInfographics, deleteInfographic, type Infographic } from '@/lib/storage'

type Ratio = '9:16' | '1:1' | '16:9'

const RATIOS: { value: Ratio; label: string; sublabel: string; icon: typeof Square }[] = [
  { value: '9:16', label: '9:16', sublabel: 'Portrait', icon: RectangleVertical },
  { value: '1:1', label: '1:1', sublabel: 'Square', icon: Square },
  { value: '16:9', label: '16:9', sublabel: 'Landscape', icon: RectangleHorizontal },
]

type Style = 'modern' | 'cartoon' | 'minimal' | 'lineart' | 'isometric' | 'flat'

const STYLES: { value: Style; label: string; sublabel: string; icon: typeof Square }[] = [
  { value: 'modern', label: 'Modern', sublabel: 'Bold vectors & gradients', icon: Sparkles },
  { value: 'cartoon', label: 'Cartoon', sublabel: 'Playful hand-drawn feel', icon: Palette },
  { value: 'minimal', label: 'Minimal', sublabel: 'Clean & understated', icon: Minus },
  { value: 'lineart', label: 'Line Art', sublabel: 'Black ink on white', icon: PenTool },
  { value: 'isometric', label: 'Isometric', sublabel: '3D perspective graphics', icon: Box },
  { value: 'flat', label: 'Flat', sublabel: 'Solid shapes, no shadows', icon: Layers },
]

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 5,
    price: '$4.99',
    perUnit: '$1.00',
    icon: Sparkles,
    accent: 'teal',
    popular: false,
    savings: '',
  },
  {
    id: 'popular',
    name: 'Creator',
    credits: 12,
    price: '$8.99',
    perUnit: '$0.75',
    icon: Zap,
    accent: 'primary',
    popular: true,
    badge: 'Best Value',
    savings: 'Save 25%',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 30,
    price: '$19.99',
    perUnit: '$0.67',
    icon: Crown,
    accent: 'amber',
    popular: false,
    savings: 'Save 33%',
  },
]

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push('/auth/login')
    }
  }, [session, sessionPending, router])

  const [url, setUrl] = useState('')
  const [selectedRatio, setSelectedRatio] = useState<Ratio>('1:1')
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [infographics, setInfographics] = useState<Infographic[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<Infographic | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Infographic | null>(null)
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null)
  const [showPricing, setShowPricing] = useState(false)
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null)

  // Credits system
  const creditsData = useQuery(api.credits.getCredits)
  const initCreditsMutation = useMutation(api.credits.initCredits)
  const useCreditMutation = useMutation(api.credits.useCredit)
  const refundCreditMutation = useMutation(api.credits.refundCredit)

  const credits = creditsData?.credits ?? null
  const creditsInitialized = creditsData?.initialized ?? false
  const isFreeCredit = creditsData?.isFreeCredit ?? false

  // Initialize credits for new users
  useEffect(() => {
    if (session && creditsData && !creditsData.initialized) {
      initCreditsMutation()
    }
  }, [session, creditsData, creditsInitialized, initCreditsMutation])

  // Show success message after payment
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      // Clear the query param
      router.replace('/dashboard')
    }
  }, [searchParams, router])

  const loadInfographics = useCallback(async () => {
    try {
      const items = await getInfographics()
      setInfographics(items)
    } catch {
      // IndexedDB not available
    }
  }, [])

  useEffect(() => {
    loadInfographics()
  }, [loadInfographics])

  const isValidYouTubeUrl = (input: string) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/.test(input)
  }

  const extractVideoId = (input: string): string | null => {
    const match = input.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const videoId = isValidYouTubeUrl(url) ? extractVideoId(url) : null

  const handleBuyCredits = async (planId: string) => {
    if (!session?.user) return
    setBuyingPlan(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          userId: session.user.id,
          userEmail: session.user.email,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to start checkout')
      }
    } catch {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setBuyingPlan(null)
    }
  }

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please paste a YouTube URL')
      return
    }
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    // Check credits
    if (credits !== null && credits <= 0) {
      setShowPricing(true)
      return
    }

    setError('')
    setIsGenerating(true)
    setCurrentStep(1)
    setGeneratingVideoId(extractVideoId(url))

    let creditDeducted = false

    try {
      // Deduct credit first
      const creditResult = await useCreditMutation()
      if (!creditResult.success) {
        setShowPricing(true)
        setIsGenerating(false)
        setCurrentStep(0)
        setGeneratingVideoId(null)
        return
      }
      creditDeducted = true

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), ratio: selectedRatio, style: selectedStyle }),
      })

      if (!response.ok || !response.body) {
        const text = await response.text()
        try {
          const data = JSON.parse(text)
          throw new Error(data.error || 'Generation failed')
        } catch (parseErr) {
          if (parseErr instanceof Error && parseErr.message !== 'Generation failed') {
            throw parseErr
          }
          throw new Error('Generation failed')
        }
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let generationSucceeded = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const dataLine = line.replace(/^data: /, '').trim()
          if (!dataLine) continue

          const event = JSON.parse(dataLine)

          if (event.type === 'progress') {
            setCurrentStep(event.step)
          } else if (event.type === 'error') {
            throw new Error(event.error)
          } else if (event.type === 'result') {
            generationSucceeded = true
            setCurrentStep(3)

            const infographic: Infographic = {
              id: crypto.randomUUID(),
              youtubeUrl: url.trim(),
              title: event.title || 'Untitled',
              imageData: event.image,
              ratio: selectedRatio,
              createdAt: Date.now(),
            }

            await saveInfographic(infographic)
            await loadInfographics()
            setPreviewImage(event.image)
          }
        }
      }

      // If stream ended without a result event, treat as failure
      if (!generationSucceeded) {
        throw new Error('Generation ended unexpectedly. Please try again.')
      }
    } catch (err) {
      // Refund the credit if it was deducted but generation failed
      if (creditDeducted) {
        try {
          await refundCreditMutation()
        } catch {
          // Silently fail refund — user can contact support
        }
      }
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
      setCurrentStep(0)
      setGeneratingVideoId(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await deleteInfographic(deleteTarget.id)
    await loadInfographics()
    setDeleteTarget(null)
  }

  const handleDownload = (infographic: Infographic) => {
    const link = document.createElement('a')
    link.href = infographic.imageData
    link.download = `infographic-${infographic.ratio.replace(':', 'x')}-${Date.now()}.png`
    link.click()
  }

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-600 shadow-md shadow-primary/20 dark:to-teal-300">
              <Zap className="h-4 w-4 text-white dark:text-black" />
            </div>
            <span className="text-base font-bold tracking-tight">
              QuickInfographics
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Admin Link */}
            {session.user?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-full bg-slate-900/10 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-900/10 transition-colors hover:bg-slate-900/15 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/15"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
            {/* Credit Badge */}
            {credits !== null && (
              <button
                onClick={() => setShowPricing(true)}
                className={`
                  flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all
                  ${credits > 0
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20 hover:bg-primary/15'
                    : 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 hover:bg-amber-500/15 dark:text-amber-400'
                  }
                `}
              >
                <CreditCard className="h-3.5 w-3.5" />
                {isFreeCredit ? `${credits} free credit` : `${credits} ${credits === 1 ? 'credit' : 'credits'}`}
              </button>
            )}
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {session.user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push('/auth/login') } })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Generator Section */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create Infographic
            </h1>
            <p className="mt-2 text-muted-foreground">
              Paste a YouTube link, pick a format and style, then generate.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            {isGenerating ? (
              <>
                {/* Embedded YouTube Video */}
                {generatingVideoId && (
                  <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${generatingVideoId}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Progress Stepper */}
                <div className="mt-6 rounded-xl border border-border/60 bg-card p-5">
                  <div className="flex items-start gap-4">
                    {[
                      { step: 1, label: 'Analyzing video', icon: Video },
                      { step: 2, label: 'Generating infographic', icon: Image },
                      { step: 3, label: 'Done', icon: Check },
                    ].map(({ step, label, icon: Icon }, idx) => {
                      const isActive = currentStep === step
                      const isCompleted = currentStep > step
                      return (
                        <div key={step} className="flex flex-1 flex-col items-center gap-2">
                          <div className="flex w-full items-center">
                            {idx > 0 && (
                              <div className={`h-0.5 flex-1 transition-colors duration-500 ${isCompleted || isActive ? 'bg-primary' : 'bg-border'}`} />
                            )}
                            <div
                              className={`
                                relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500
                                ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                                ${isActive ? 'bg-primary/15 text-primary ring-2 ring-primary/30' : ''}
                                ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                              `}
                            >
                              {isActive && (
                                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                              )}
                              {isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Icon className="relative h-4 w-4" />
                              )}
                            </div>
                            {idx < 2 && (
                              <div className={`h-0.5 flex-1 transition-colors duration-500 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                            )}
                          </div>
                          <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Status text */}
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" />
                  {currentStep === 1 ? 'Analyzing video content...' : currentStep === 2 ? 'Generating your infographic...' : 'Finishing up...'}
                </p>
              </>
            ) : (
              <div className="space-y-6">
                {/* Step 1: Paste URL */}
                <div>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${videoId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {videoId ? <Check className="h-3.5 w-3.5" /> : '1'}
                    </div>
                    <span className="text-sm font-semibold">Paste YouTube URL</span>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value)
                        setError('')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isGenerating && selectedStyle) handleGenerate()
                      }}
                      className="w-full rounded-xl border border-border/60 bg-card px-5 py-4 text-base shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    {error && (
                      <Alert variant="destructive" className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between gap-2">
                          <span>{error}</span>
                          <button
                            onClick={() => setError('')}
                            className="shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* YouTube Video Preview */}
                  {videoId && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt="Video thumbnail"
                          className="h-full w-full object-cover"
                        />
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110">
                            <Play className="h-6 w-6 fill-white" />
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Select Format */}
                <div className={`transition-all duration-300 ${!videoId ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${videoId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {videoId ? <Check className="h-3.5 w-3.5" /> : '2'}
                    </div>
                    <span className="text-sm font-semibold">Select Format</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {RATIOS.map((ratio) => {
                      const Icon = ratio.icon
                      const isSelected = selectedRatio === ratio.value
                      return (
                        <button
                          key={ratio.value}
                          onClick={() => setSelectedRatio(ratio.value)}
                          className={`
                            group relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all
                            ${isSelected
                              ? 'border-primary bg-primary/[0.06] shadow-md shadow-primary/10'
                              : 'border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02]'
                            }
                          `}
                        >
                          <Icon
                            className={`h-8 w-8 transition-colors ${
                              isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/70'
                            }`}
                            strokeWidth={1.5}
                          />
                          <span className={`text-lg font-bold font-mono ${
                            isSelected ? 'text-primary' : 'text-foreground'
                          }`}>
                            {ratio.label}
                          </span>
                          <span className={`text-xs ${
                            isSelected ? 'text-primary/70' : 'text-muted-foreground'
                          }`}>
                            {ratio.sublabel}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-px -right-px -bottom-px -left-px rounded-xl ring-2 ring-primary/30 pointer-events-none" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 3: Select Style */}
                <div className={`transition-all duration-300 ${!videoId ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selectedStyle ? 'bg-primary text-primary-foreground' : videoId ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {selectedStyle ? <Check className="h-3.5 w-3.5" /> : '3'}
                    </div>
                    <span className="text-sm font-semibold">Select Style</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {STYLES.map((style) => {
                      const Icon = style.icon
                      const isSelected = selectedStyle === style.value
                      return (
                        <button
                          key={style.value}
                          onClick={() => setSelectedStyle(style.value)}
                          className={`
                            group relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all
                            ${isSelected
                              ? 'border-primary bg-primary/[0.06] shadow-md shadow-primary/10'
                              : 'border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02]'
                            }
                          `}
                        >
                          <Icon
                            className={`h-7 w-7 transition-colors ${
                              isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/70'
                            }`}
                            strokeWidth={1.5}
                          />
                          <span className={`text-sm font-bold ${
                            isSelected ? 'text-primary' : 'text-foreground'
                          }`}>
                            {style.label}
                          </span>
                          <span className={`text-[11px] leading-tight ${
                            isSelected ? 'text-primary/70' : 'text-muted-foreground'
                          }`}>
                            {style.sublabel}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-px -right-px -bottom-px -left-px rounded-xl ring-2 ring-primary/30 pointer-events-none" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 4: Generate */}
                <div className={`transition-all duration-300 ${!videoId || !selectedStyle ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${videoId && selectedStyle ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      4
                    </div>
                    <span className="text-sm font-semibold">Generate</span>
                  </div>
                  {credits !== null && credits <= 0 ? (
                    <Button
                      size="lg"
                      onClick={() => setShowPricing(true)}
                      className="w-full h-12 text-base bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Buy Credits to Generate
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={!url.trim() || !selectedStyle}
                      className="w-full h-12 text-base shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 disabled:shadow-none"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Infographic
                      {credits !== null && (
                        <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                          1 credit
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview of just-generated image */}
        {previewImage && (
          <div className="mb-16">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Latest Generation</h3>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                <img
                  src={previewImage}
                  alt="Generated infographic"
                  className="w-full rounded-lg cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => {
                    const match = infographics.find(i => i.imageData === previewImage)
                    if (match) setLightbox(match)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Gallery */}
        {infographics.length > 0 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Infographics</h2>
              <span className="text-sm text-muted-foreground">
                {infographics.length} saved locally
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {infographics.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => setLightbox(item)}>
                    <img
                      src={item.imageData}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                        {item.ratio}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {infographics.length === 0 && !previewImage && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
              <Sparkles className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your generated infographics will appear here
            </p>
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete infographic?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{deleteTarget?.title}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pricing Modal */}
      <AlertDialog open={showPricing} onOpenChange={setShowPricing}>
        <AlertDialogContent className="sm:!max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain [&]:p-4 sm:[&]:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              {credits !== null && credits <= 0 ? 'You\'re out of credits' : 'Buy More Credits'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Choose a credit pack to continue creating infographics.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 gap-3 pt-2 pb-2 sm:grid-cols-3 sm:gap-5 sm:pt-4 items-stretch">
            {PLANS.map((plan) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.id}
                  className={`
                    relative flex flex-col overflow-visible rounded-xl border-2 p-3 sm:p-5 transition-all h-full
                    ${plan.popular
                      ? 'border-primary bg-primary/[0.04] shadow-md shadow-primary/10'
                      : 'border-border/60 bg-card hover:border-primary/30'
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                        <Crown className="h-2.5 w-2.5" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Mobile: compact horizontal row */}
                  <div className="flex sm:hidden items-center gap-3">
                    <div className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                      plan.popular
                        ? 'bg-primary/15 text-primary'
                        : plan.accent === 'amber'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold">{plan.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold">{plan.price}</span>
                        <span className="text-xs text-muted-foreground">{plan.credits} credits</span>
                        {plan.savings && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {plan.savings}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={plan.popular ? 'default' : 'outline'}
                      className={`shrink-0 h-10 px-4 text-sm font-bold ${plan.popular ? 'shadow-md shadow-primary/20' : ''}`}
                      onClick={() => handleBuyCredits(plan.id)}
                      disabled={buyingPlan === plan.id}
                    >
                      {buyingPlan === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>Buy</>
                      )}
                    </Button>
                  </div>

                  {/* Desktop: vertical card layout */}
                  <div className="hidden sm:flex sm:flex-col sm:h-full">
                    <div className="mb-5 flex-1">
                      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                        plan.popular
                          ? 'bg-primary/15 text-primary'
                          : plan.accent === 'amber'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold">{plan.price}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {plan.credits} credits &middot; {plan.perUnit}/each
                      </p>
                      {plan.savings && (
                        <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {plan.savings}
                        </span>
                      )}
                    </div>

                    <Button
                      size="lg"
                      variant={plan.popular ? 'default' : 'outline'}
                      className={`w-full h-12 text-base font-bold ${plan.popular ? 'shadow-md shadow-primary/20' : ''}`}
                      onClick={() => handleBuyCredits(plan.id)}
                      disabled={buyingPlan === plan.id}
                    >
                      {buyingPlan === plan.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Buy {plan.credits} Credits
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel className="sm:w-auto">
              Maybe Later
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          {/* Top bar */}
          <div className="absolute top-0 right-0 left-0 flex items-center justify-between px-5 py-4 z-10">
            <p className="text-sm font-medium text-white/70 truncate max-w-[60%]">
              {lightbox.title}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(lightbox) }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image */}
          <img
            src={lightbox.imageData}
            alt={lightbox.title}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
