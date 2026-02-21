import { VisualValidator } from './visual-validator.js';
import { SpriteAnalyzer } from './sprite-analyzer.js';
import { MapValidator } from './map-validator.js';
import { EventVerifier } from './event-verifier.js';
import { ContentValidator } from './content-validator.js';
import { logger } from './logger.js';
import type { ValidationReport } from './types.js';

export interface OrchestratorReport {
  timestamp: string;
  duration: number;
  validators: {
    visual: ValidationReport;
    sprite: ValidationReport;
    map: ValidationReport;
    event: ValidationReport;
    content: ValidationReport;
  };
  summary: {
    totalValidators: number;
    totalChecks: number;
    totalPassed: number;
    totalFailed: number;
    totalWarnings: number;
  };
}

export class ValidationOrchestrator {
  async runAll(): Promise<OrchestratorReport> {
    const startTime = Date.now();
    logger.info('=== Validation Orchestrator ===');
    logger.info('Running all validators in parallel...\n');

    const [visualReport, spriteReport, mapReport, eventReport, contentReport] = await Promise.all([
      this.runVisualValidator(),
      this.runSpriteAnalyzer(),
      this.runMapValidator(),
      this.runEventVerifier(),
      this.runContentValidator(),
    ]);

    const duration = Date.now() - startTime;

    const summary = {
      totalValidators: 5,
      totalChecks:
        visualReport.summary.totalChecks +
        spriteReport.summary.totalChecks +
        mapReport.summary.totalChecks +
        eventReport.summary.totalChecks +
        contentReport.summary.totalChecks,
      totalPassed:
        visualReport.summary.passed +
        spriteReport.summary.passed +
        mapReport.summary.passed +
        eventReport.summary.passed +
        contentReport.summary.passed,
      totalFailed:
        visualReport.summary.failed +
        spriteReport.summary.failed +
        mapReport.summary.failed +
        eventReport.summary.failed +
        contentReport.summary.failed,
      totalWarnings:
        visualReport.summary.warnings +
        spriteReport.summary.warnings +
        mapReport.summary.warnings +
        eventReport.summary.warnings +
        contentReport.summary.warnings,
    };

    logger.info('\n=== Orchestrator Summary ===');
    logger.info(`Total validators: ${summary.totalValidators}`);
    logger.info(`Total checks: ${summary.totalChecks}`);
    logger.info(`Total passed: ${summary.totalPassed}`);
    logger.info(`Total failed: ${summary.totalFailed}`);
    logger.info(`Total warnings: ${summary.totalWarnings}`);
    logger.info(`Duration: ${duration}ms`);

    return {
      timestamp: new Date().toISOString(),
      duration,
      validators: {
        visual: visualReport,
        sprite: spriteReport,
        map: mapReport,
        event: eventReport,
        content: contentReport,
      },
      summary,
    };
  }

  private async runVisualValidator(): Promise<ValidationReport> {
    logger.info('Running Visual Validator...');
    const validator = new VisualValidator();
    const report = await validator.validate();
    logger.info(`✓ Visual Validator complete (${report.summary.totalChecks} checks)`);
    return report;
  }

  private async runSpriteAnalyzer(): Promise<ValidationReport> {
    logger.info('Running Sprite Analyzer...');
    const analyzer = new SpriteAnalyzer();
    const report = await analyzer.analyze();
    logger.info(`✓ Sprite Analyzer complete (${report.summary.totalChecks} checks)`);
    return report;
  }

  private async runMapValidator(): Promise<ValidationReport> {
    logger.info('Running Map Validator...');
    const validator = new MapValidator();
    const report = await validator.validateAllMaps();
    logger.info(`✓ Map Validator complete (${report.summary.totalChecks} checks)`);
    return report;
  }

  private async runEventVerifier(): Promise<ValidationReport> {
    logger.info('Running Event Verifier...');
    const verifier = new EventVerifier();
    const report = await verifier.validate();
    logger.info(`✓ Event Verifier complete (${report.summary.totalChecks} checks)`);
    return report;
  }

  private async runContentValidator(): Promise<ValidationReport> {
    logger.info('Running Content Validator...');
    const validator = new ContentValidator();
    const report = await validator.validate();
    logger.info(`✓ Content Validator complete (${report.summary.totalChecks} checks)`);
    return report;
  }
}
