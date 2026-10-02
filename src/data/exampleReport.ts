/**
 * Hero "results report" mock. ILLUSTRATIVE EXAMPLE DATA, always shown under an
 * "Example report" badge. The strings (including the numbers) live in en.json
 * under home.report.<id>.*; confirm or replace them with Oby before launch.
 */
export const EXAMPLE_REPORT_WORKFLOWS = ["enquiry", "proposal"] as const;
export type ExampleReportWorkflow = (typeof EXAMPLE_REPORT_WORKFLOWS)[number];

/** Each workflow has row1..rowN with Label / Day0 / Day30 keys. */
export const EXAMPLE_REPORT_ROW_COUNT = 3;
