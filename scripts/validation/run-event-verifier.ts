// Runner script for Event Verifier
import { EventVerifier } from './event-verifier.js';

const verifier = new EventVerifier();
await verifier.generateReports();
