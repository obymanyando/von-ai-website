import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { SEO } from "@/components/SEO";

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy — VonAI"
        description="How VonAI collects, uses, and protects personal data submitted through our website and contact form."
        canonical="/privacy"
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold">Who we are</h2>
              <p className="text-muted-foreground">
                VonAI ("we", "us") operates this website and provides AI consulting services.
                For any privacy-related questions, contact us at{" "}
                <a href="mailto:hello@von-ai.com" className="text-primary hover:underline">
                  hello@von-ai.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">What we collect</h2>
              <p className="text-muted-foreground">
                When you submit our contact form we collect the information you provide:
                name, email address, optional company name, and your message. We also record
                the date and time you gave consent to this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">How we use it</h2>
              <p className="text-muted-foreground">
                We use your information solely to respond to your enquiry and, where relevant,
                follow up about our services. We do not sell or share your data with third
                parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Legal basis (GDPR)</h2>
              <p className="text-muted-foreground">
                Our legal basis for processing the data you submit through the contact form is
                your explicit consent (Article 6(1)(a) GDPR), which you provide by ticking the
                consent checkbox before sending your message.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Retention</h2>
              <p className="text-muted-foreground">
                Contact submissions are retained for as long as needed to handle your enquiry
                and any resulting business relationship, after which they are deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Your rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, correct, or request deletion of your personal
                data, and to withdraw consent at any time. To exercise any of these rights,
                email{" "}
                <a href="mailto:hello@von-ai.com" className="text-primary hover:underline">
                  hello@von-ai.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </Section>
    </Layout>
  );
}