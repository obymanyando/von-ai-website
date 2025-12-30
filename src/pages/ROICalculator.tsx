import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const { t, i18n } = useTranslation();
  
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
    const locale = i18n.language === 'fi' ? 'fi-FI' : 'en-EU';
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const startingPoints = [
    { value: "sales", label: t('roiCalculator.step1.sales'), desc: t('roiCalculator.step1.salesDesc') },
    { value: "service", label: t('roiCalculator.step1.service'), desc: t('roiCalculator.step1.serviceDesc') },
    { value: "operations", label: t('roiCalculator.step1.operations'), desc: t('roiCalculator.step1.operationsDesc') },
  ];

  const timeSavingsOptions = [
    { value: "conservative", label: t('roiCalculator.step2.conservative'), desc: "10%" },
    { value: "likely", label: t('roiCalculator.step2.likely'), desc: "25%" },
    { value: "aggressive", label: t('roiCalculator.step2.aggressive'), desc: "40%" },
  ];

  const conversionOptions = [
    { value: "conservative", label: t('roiCalculator.step3.conservative'), desc: "+0.5%" },
    { value: "likely", label: t('roiCalculator.step3.likely'), desc: "+1.0%" },
    { value: "aggressive", label: t('roiCalculator.step3.aggressive'), desc: "+2.0%" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Calculator className="mr-2 h-4 w-4" />
              {t('roiCalculator.hero.badge')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t('roiCalculator.hero.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('roiCalculator.hero.subtitle')}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <AlertCircle className="mb-0.5 mr-1 inline h-4 w-4" />
              {t('roiCalculator.hero.disclaimer')}
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
                {t('roiCalculator.step1.title')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {startingPoints.map((option) => (
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
                {t('roiCalculator.step2.title')}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {t('roiCalculator.step2.subtitle')}
                </span>
              </h2>

              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="items">{t('roiCalculator.step2.itemsPerMonth')}</Label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {t('roiCalculator.step2.itemsHint')}
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
                    <Label htmlFor="minutes">{t('roiCalculator.step2.minutesPerItem')}</Label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {t('roiCalculator.step2.minutesHint')}
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
                  <Label>{t('roiCalculator.step2.timeSaved')}</Label>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {timeSavingsOptions.map((option) => (
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
                  <Label htmlFor="hourly">{t('roiCalculator.step2.hourlyRate')}</Label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {t('roiCalculator.step2.hourlyHint')}
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
                    {t('roiCalculator.step3.title')}
                  </h2>
                  <p className="text-sm text-muted-foreground">{t('roiCalculator.step3.subtitle')}</p>
                </div>
                <Switch
                  checked={includeRevenue}
                  onCheckedChange={setIncludeRevenue}
                />
              </div>

              {includeRevenue && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="leads">{t('roiCalculator.step3.leadsPerMonth')}</Label>
                    <Input
                      id="leads"
                      type="number"
                      value={leadsPerMonth}
                      onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div>
                    <Label>{t('roiCalculator.step3.conversionImprovement')}</Label>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {conversionOptions.map((option) => (
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
                    <Label htmlFor="profit">{t('roiCalculator.step3.grossProfit')}</Label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {t('roiCalculator.step3.grossProfitHint')}
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
                    {t('roiCalculator.step4.title')}
                  </h2>
                  <p className="text-sm text-muted-foreground">{t('roiCalculator.step4.subtitle')}</p>
                </div>
                <Switch
                  checked={includeCosts}
                  onCheckedChange={setIncludeCosts}
                />
              </div>

              {includeCosts && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="setup">{t('roiCalculator.step4.setupCost')}</Label>
                    <Input
                      id="setup"
                      type="number"
                      value={setupCost}
                      onChange={(e) => setSetupCost(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly">{t('roiCalculator.step4.monthlyCost')}</Label>
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
                {t('roiCalculator.results.title')}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{t('roiCalculator.results.timeSaved')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{results.hoursSaved} {t('roiCalculator.results.hoursPerMonth')}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-4 w-4" />
                    <span>{t('roiCalculator.results.valueTimeSaved')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{formatCurrency(results.valueSaved)}{t('roiCalculator.results.perMonth')}</div>
                  </div>
                </div>

                {includeRevenue && (
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{t('roiCalculator.results.grossProfitUplift')}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{formatCurrency(results.revenueUplift)}{t('roiCalculator.results.perMonth')}</div>
                      <div className="text-xs text-muted-foreground">{t('roiCalculator.results.estimate')}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    {t('roiCalculator.results.netBenefit')}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${results.netBenefit >= 0 ? "text-primary" : "text-destructive"}`}>
                      {formatCurrency(results.netBenefit)}{t('roiCalculator.results.perMonth')}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="text-sm text-muted-foreground">{t('roiCalculator.results.impact90Days')}</div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(results.impact90Days)}
                  </div>
                </div>

                {results.paybackMonths !== null && includeCosts && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">{t('roiCalculator.results.payback')}</div>
                      <div className="text-lg font-bold text-foreground">
                        {results.paybackMonths === 0 ? t('roiCalculator.results.immediate') : `${results.paybackMonths} ${t('roiCalculator.results.months')}`}
                      </div>
                    </div>
                    {results.annualROI !== null && (
                      <div>
                        <div className="text-sm text-muted-foreground">{t('roiCalculator.results.annualROI')}</div>
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
                    {t('aiRoiSprint.cta.estimateRoi')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t('roiCalculator.hero.disclaimer')}
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
