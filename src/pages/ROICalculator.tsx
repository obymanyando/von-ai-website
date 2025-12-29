import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Clock,
  Euro,
  AlertCircle,
} from "lucide-react";

type StartingPoint = "sales" | "service" | "operations";
type TimeSavingsLevel = "conservative" | "likely" | "aggressive";
type ConversionLevel = "conservative" | "likely" | "aggressive";

const timeSavingsMap: Record<TimeSavingsLevel, number> = {
  conservative: 0.1,
  likely: 0.25,
  aggressive: 0.4,
};

const conversionMap: Record<ConversionLevel, number> = {
  conservative: 0.005,
  likely: 0.01,
  aggressive: 0.02,
};

export default function ROICalculator() {
  // Step 1: Starting point
  const [startingPoint, setStartingPoint] = useState<StartingPoint>("sales");

  // Step 2: Time savings
  const [itemsPerMonth, setItemsPerMonth] = useState(500);
  const [minutesPerItem, setMinutesPerItem] = useState(10);
  const [timeSavingsLevel, setTimeSavingsLevel] = useState<TimeSavingsLevel>("likely");
  const [hourlyRate, setHourlyRate] = useState(45);

  // Step 3: Revenue impact (optional)
  const [includeRevenue, setIncludeRevenue] = useState(false);
  const [leadsPerMonth, setLeadsPerMonth] = useState(100);
  const [conversionLevel, setConversionLevel] = useState<ConversionLevel>("likely");
  const [grossProfitPerSale, setGrossProfitPerSale] = useState(500);

  // Step 4: Costs (optional)
  const [includeCosts, setIncludeCosts] = useState(false);
  const [setupCost, setSetupCost] = useState(5000);
  const [monthlyCost, setMonthlyCost] = useState(500);

  // Calculations
  const results = useMemo(() => {
    const timeSavingsPercent = timeSavingsMap[timeSavingsLevel];
    const conversionImprovement = conversionMap[conversionLevel];

    // Time savings
    const totalMinutesToday = itemsPerMonth * minutesPerItem;
    const minutesSaved = totalMinutesToday * timeSavingsPercent;
    const hoursSaved = minutesSaved / 60;
    const valueSaved = hoursSaved * hourlyRate;

    // Revenue impact
    let revenueUplift = 0;
    if (includeRevenue) {
      const additionalConversions = leadsPerMonth * conversionImprovement;
      revenueUplift = additionalConversions * grossProfitPerSale;
    }

    // Monthly benefit
    const grossBenefit = valueSaved + revenueUplift;
    const monthlyToolCost = includeCosts ? monthlyCost : 0;
    const netBenefit = grossBenefit - monthlyToolCost;

    // 90-day impact
    const impact90Days = netBenefit * 3;

    // Payback & ROI (only if positive)
    const oneTimeSetup = includeCosts ? setupCost : 0;
    let paybackMonths: number | null = null;
    let annualROI: number | null = null;

    if (netBenefit > 0 && oneTimeSetup > 0) {
      paybackMonths = oneTimeSetup / netBenefit;
      const annualNetBenefit = netBenefit * 12;
      annualROI = ((annualNetBenefit - oneTimeSetup) / oneTimeSetup) * 100;
    } else if (netBenefit > 0 && oneTimeSetup === 0) {
      paybackMonths = 0;
      annualROI = null; // Infinite ROI if no setup cost
    }

    return {
      hoursSaved: Math.round(hoursSaved * 10) / 10,
      valueSaved: Math.round(valueSaved),
      revenueUplift: Math.round(revenueUplift),
      netBenefit: Math.round(netBenefit),
      impact90Days: Math.round(impact90Days),
      paybackMonths: paybackMonths !== null ? Math.round(paybackMonths * 10) / 10 : null,
      annualROI: annualROI !== null ? Math.round(annualROI) : null,
    };
  }, [
    itemsPerMonth,
    minutesPerItem,
    timeSavingsLevel,
    hourlyRate,
    includeRevenue,
    leadsPerMonth,
    conversionLevel,
    grossProfitPerSale,
    includeCosts,
    setupCost,
    monthlyCost,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Calculator className="mr-2 h-4 w-4" />
              Self-serve estimate
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              ROI Calculator
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Get a conservative ballpark estimate of what one AI workflow could save you in the next 90 days.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <AlertCircle className="mb-0.5 mr-1 inline h-4 w-4" />
              These are estimates, not promises. The Sprint validates the inputs and turns this into a real plan.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Calculator Inputs */}
          <div className="space-y-10">
            {/* Step 1: Starting Point */}
            <div>
              <h2 className="mb-6 text-xl font-bold text-foreground">
                Step 1: Choose a starting point
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "sales", label: "Sales", desc: "More customers, faster" },
                  { value: "service", label: "Service", desc: "Deflect + retain" },
                  { value: "operations", label: "Operations", desc: "Less admin" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStartingPoint(option.value as StartingPoint)}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      startingPoint === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold text-foreground">{option.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Time Savings */}
            <div>
              <h2 className="mb-6 text-xl font-bold text-foreground">
                Step 2: Time savings
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (the most defensible ROI)
                </span>
              </h2>

              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="items">Items per month</Label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      e.g., leads, follow-ups, tickets, requests
                    </p>
                    <Input
                      id="items"
                      type="number"
                      value={itemsPerMonth}
                      onChange={(e) => setItemsPerMonth(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes">Minutes per item today</Label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Average time spent per item
                    </p>
                    <Input
                      id="minutes"
                      type="number"
                      value={minutesPerItem}
                      onChange={(e) => setMinutesPerItem(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <Label>% time saved</Label>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { value: "conservative", label: "Conservative", desc: "10%" },
                      { value: "likely", label: "Likely", desc: "25%" },
                      { value: "aggressive", label: "Aggressive", desc: "40%" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTimeSavingsLevel(option.value as TimeSavingsLevel)}
                        className={`rounded-lg border px-4 py-3 text-center transition-all ${
                          timeSavingsLevel === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-sm font-medium text-foreground">{option.label}</div>
                        <div className="text-lg font-bold text-primary">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="hourly">Fully-loaded hourly cost (€)</Label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    If unsure, use €35–€60/hr depending on role
                  </p>
                  <Input
                    id="hourly"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Revenue Impact (Optional) */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Step 3: Revenue impact
                  </h2>
                  <p className="text-sm text-muted-foreground">(optional)</p>
                </div>
                <Switch
                  checked={includeRevenue}
                  onCheckedChange={setIncludeRevenue}
                />
              </div>

              {includeRevenue && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="leads">Leads per month</Label>
                    <Input
                      id="leads"
                      type="number"
                      value={leadsPerMonth}
                      onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div>
                    <Label>Conversion improvement</Label>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        { value: "conservative", label: "Conservative", desc: "+0.5%" },
                        { value: "likely", label: "Likely", desc: "+1.0%" },
                        { value: "aggressive", label: "Aggressive", desc: "+2.0%" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setConversionLevel(option.value as ConversionLevel)}
                          className={`rounded-lg border px-4 py-3 text-center transition-all ${
                            conversionLevel === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="text-sm font-medium text-foreground">{option.label}</div>
                          <div className="text-lg font-bold text-primary">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profit">Gross profit per sale (€)</Label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Profit, not revenue. If unsure: avg deal value × gross margin
                    </p>
                    <Input
                      id="profit"
                      type="number"
                      value={grossProfitPerSale}
                      onChange={(e) => setGrossProfitPerSale(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Costs (Optional) */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Step 4: Costs
                  </h2>
                  <p className="text-sm text-muted-foreground">(advanced / optional)</p>
                </div>
                <Switch
                  checked={includeCosts}
                  onCheckedChange={setIncludeCosts}
                />
              </div>

              {includeCosts && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="setup">One-time setup cost (€)</Label>
                    <Input
                      id="setup"
                      type="number"
                      value={setupCost}
                      onChange={(e) => setSetupCost(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly">Monthly tools/support cost (€)</Label>
                    <Input
                      id="monthly"
                      type="number"
                      value={monthlyCost}
                      onChange={(e) => setMonthlyCost(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:sticky lg:top-24">
            <Card variant="elevated" className="bg-card">
              <h3 className="mb-6 text-lg font-bold text-foreground">
                Your ballpark ROI
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Time saved</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{results.hoursSaved} hrs/mo</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-4 w-4" />
                    <span>Value of time saved</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{formatCurrency(results.valueSaved)}/mo</div>
                  </div>
                </div>

                {includeRevenue && (
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Gross profit uplift</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{formatCurrency(results.revenueUplift)}/mo</div>
                      <div className="text-xs text-muted-foreground">estimate</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    Net benefit
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${results.netBenefit >= 0 ? "text-primary" : "text-destructive"}`}>
                      {formatCurrency(results.netBenefit)}/mo
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="text-sm text-muted-foreground">90-day impact</div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(results.impact90Days)}
                  </div>
                </div>

                {results.paybackMonths !== null && includeCosts && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Payback</div>
                      <div className="text-lg font-bold text-foreground">
                        {results.paybackMonths === 0 ? "Immediate" : `${results.paybackMonths} mo`}
                      </div>
                    </div>
                    {results.annualROI !== null && (
                      <div>
                        <div className="text-sm text-muted-foreground">Annual ROI</div>
                        <div className="text-lg font-bold text-foreground">{results.annualROI}%</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <CTAButton variant="primary" size="lg" className="w-full" />
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/ai-roi-sprint">
                    See what the Sprint includes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              We'll validate your assumptions during the Sprint and pressure-test them against your workflows, tools, and constraints.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
