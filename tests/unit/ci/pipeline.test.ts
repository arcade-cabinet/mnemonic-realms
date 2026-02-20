import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

describe('CI/CD Pipeline Configuration', () => {
  const workflowPath = '.github/workflows/build-deploy.yml';
  const workflowContent = readFileSync(workflowPath, 'utf-8');
  const workflow = parse(workflowContent);

  describe('Automated Testing', () => {
    it('should run unit tests', () => {
      const buildJob = workflow.jobs.build;
      const testStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('unit tests'),
      );
      expect(testStep).toBeDefined();
      expect(testStep.run).toBe('pnpm test:unit');
    });

    it('should run linter before tests', () => {
      const buildJob = workflow.jobs.build;
      const lintIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('linter'),
      );
      const testIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('unit tests'),
      );
      expect(lintIndex).toBeGreaterThan(-1);
      expect(testIndex).toBeGreaterThan(-1);
      expect(lintIndex).toBeLessThan(testIndex);
    });
  });

  describe('Content Generation', () => {
    it('should generate runtime content before build', () => {
      const buildJob = workflow.jobs.build;
      const genIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Generate runtime content'),
      );
      const buildIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Build web'),
      );
      expect(genIndex).toBeGreaterThan(-1);
      expect(buildIndex).toBeGreaterThan(-1);
      expect(genIndex).toBeLessThan(buildIndex);
    });

    it('should validate runtime content after generation', () => {
      const buildJob = workflow.jobs.build;
      const genIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Generate runtime content'),
      );
      const validateIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Validate runtime content'),
      );
      expect(genIndex).toBeGreaterThan(-1);
      expect(validateIndex).toBeGreaterThan(-1);
      expect(genIndex).toBeLessThan(validateIndex);
    });
  });

  describe('Build Validation', () => {
    it('should build web (PWA)', () => {
      const buildJob = workflow.jobs.build;
      const buildStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Build web'),
      );
      expect(buildStep).toBeDefined();
      expect(buildStep.run).toBe('pnpm build:web');
    });

    it('should validate build output', () => {
      const buildJob = workflow.jobs.build;
      const validateStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Validate build output'),
      );
      expect(validateStep).toBeDefined();
      expect(validateStep.run).toContain('dist');
    });

    it('should not have Capacitor steps', () => {
      const buildJob = workflow.jobs.build;
      const capStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Capacitor'),
      );
      expect(capStep).toBeUndefined();
    });

    it('should not have iOS/Android sync steps', () => {
      const buildJob = workflow.jobs.build;
      const iosStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Sync iOS'),
      );
      const androidStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Sync Android'),
      );
      expect(iosStep).toBeUndefined();
      expect(androidStep).toBeUndefined();
    });
  });

  describe('Build Order', () => {
    it('should run tests before building', () => {
      const buildJob = workflow.jobs.build;
      const testIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('unit tests'),
      );
      const buildIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Build web'),
      );
      expect(testIndex).toBeGreaterThan(-1);
      expect(buildIndex).toBeGreaterThan(-1);
      expect(testIndex).toBeLessThan(buildIndex);
    });

    it('should validate build output after building', () => {
      const buildJob = workflow.jobs.build;
      const buildIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Build web'),
      );
      const validateIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Validate build output'),
      );
      expect(buildIndex).toBeGreaterThan(-1);
      expect(validateIndex).toBeGreaterThan(-1);
      expect(buildIndex).toBeLessThan(validateIndex);
    });
  });

  describe('Workflow Configuration', () => {
    it('should trigger on push to main', () => {
      expect(workflow.on.push.branches).toContain('main');
    });

    it('should trigger on pull requests to main', () => {
      expect(workflow.on.pull_request.branches).toContain('main');
    });

    it('should support manual workflow dispatch', () => {
      expect(workflow.on.workflow_dispatch).toBeDefined();
    });

    it('should run on ubuntu-latest', () => {
      expect(workflow.jobs.build['runs-on']).toBe('ubuntu-latest');
    });
  });
});
