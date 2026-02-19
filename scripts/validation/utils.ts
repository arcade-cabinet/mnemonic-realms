// Utility functions for validation tools
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ValidationReport } from './types.js';

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function readFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

export function writeFile(path: string, content: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, content, 'utf-8');
}

export function writeJsonReport(path: string, report: ValidationReport): void {
  writeFile(path, JSON.stringify(report, null, 2));
}

export function writeMarkdownReport(path: string, content: string): void {
  writeFile(path, content);
}

export function generateReportId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

export function calculateDuration(startTime: number): number {
  return Date.now() - startTime;
}

export function ensureDirectory(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export function getReportOutputPath(reportType: string, format: 'json' | 'md'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const ext = format === 'json' ? 'json' : 'md';
  return join('scripts', 'validation', `${reportType}-report-${timestamp}.${ext}`);
}
