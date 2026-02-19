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

    it('should run E2E tests', () => {
      const buildJob = workflow.jobs.build;
      const testStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('E2E tests'),
      );
      expect(testStep).toBeDefined();
      expect(testStep.run).toBe('pnpm test');
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

  describe('Build Validation', () => {
    it('should build web (PWA)', () => {
      const buildJob = workflow.jobs.build;
      const buildStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Build web'),
      );
      expect(buildStep).toBeDefined();
      expect(buildStep.run).toBe('pnpm build:web');
    });

    it('should validate PWA manifest', () => {
      const buildJob = workflow.jobs.build;
      const validateStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Validate PWA manifest'),
      );
      expect(validateStep).toBeDefined();
      expect(validateStep.run).toContain('manifest.json');
    });

    it('should validate service worker', () => {
      const buildJob = workflow.jobs.build;
      const validateStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Validate service worker'),
      );
      expect(validateStep).toBeDefined();
      expect(validateStep.run).toContain('service-worker.js');
    });

    it('should validate Capacitor configuration', () => {
      const buildJob = workflow.jobs.build;
      const validateStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Validate Capacitor configuration'),
      );
      expect(validateStep).toBeDefined();
      expect(validateStep.run).toContain('capacitor.config.ts');
    });

    it('should sync iOS build', () => {
      const buildJob = workflow.jobs.build;
      const syncStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Sync iOS build'),
      );
      expect(syncStep).toBeDefined();
      expect(syncStep.run).toBe('npx cap sync ios');
    });

    it('should sync Android build', () => {
      const buildJob = workflow.jobs.build;
      const syncStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Sync Android build'),
      );
      expect(syncStep).toBeDefined();
      expect(syncStep.run).toBe('npx cap sync android');
    });

    it('should verify iOS project', () => {
      const buildJob = workflow.jobs.build;
      const verifyStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Verify iOS project'),
      );
      expect(verifyStep).toBeDefined();
      expect(verifyStep.run).toContain('ios/App');
    });

    it('should verify Android project', () => {
      const buildJob = workflow.jobs.build;
      const verifyStep = buildJob.steps.find((step: { name: string }) =>
        step.name.includes('Verify Android project'),
      );
      expect(verifyStep).toBeDefined();
      expect(verifyStep.run).toContain('android/app');
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

    it('should validate PWA assets after building', () => {
      const buildJob = workflow.jobs.build;
      const buildIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Build web'),
      );
      const validateIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Validate PWA manifest'),
      );
      expect(buildIndex).toBeGreaterThan(-1);
      expect(validateIndex).toBeGreaterThan(-1);
      expect(buildIndex).toBeLessThan(validateIndex);
    });

    it('should sync native builds after validating PWA', () => {
      const buildJob = workflow.jobs.build;
      const validateIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Validate service worker'),
      );
      const syncIndex = buildJob.steps.findIndex((step: { name: string }) =>
        step.name.includes('Sync iOS build'),
      );
      expect(validateIndex).toBeGreaterThan(-1);
      expect(syncIndex).toBeGreaterThan(-1);
      expect(validateIndex).toBeLessThan(syncIndex);
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
