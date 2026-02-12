/**
 * Yuka.js AI Governor for Automated Playtesting
 * 
 * Provides intelligent player control for automated testing scenarios
 * Uses Finite State Machine (FSM) for behavior management
 */

import * as YUKA from 'yuka';

/**
 * Player states for FSM
 */
export enum PlayerState {
  IDLE = 'IDLE',
  EXPLORING = 'EXPLORING',
  MOVING_TO_TARGET = 'MOVING_TO_TARGET',
  INTERACTING = 'INTERACTING',
  COMBAT = 'COMBAT',
  GATHERING = 'GATHERING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Goal types for AI scenarios
 */
export interface AIGoal {
  type: 'move' | 'interact' | 'combat' | 'gather' | 'explore';
  target?: { x: number; y: number };
  targetEntity?: string;
  duration?: number;
  condition?: () => boolean;
}

/**
 * AI Governor configuration
 */
export interface GovernorConfig {
  worldSeed: string;
  startPosition: { x: number; y: number };
  goals: AIGoal[];
  maxDuration: number; // seconds
  aggressiveness: number; // 0-1
  exploration: number; // 0-1
}

/**
 * Player AI Governor using Yuka.js
 * Controls player character for automated testing
 */
export class PlayerGovernor {
  private vehicle: YUKA.Vehicle;
  private stateMachine: YUKA.StateMachine<PlayerGovernor>;
  private entityManager: YUKA.EntityManager;
  private time: YUKA.Time;
  private currentGoal: AIGoal | null = null;
  private completedGoals: AIGoal[] = [];
  private startTime: number = 0;
  private config: GovernorConfig;
  
  // Metrics
  public metrics = {
    distanceTraveled: 0,
    goalsCompleted: 0,
    interactionsPerformed: 0,
    combatEncounters: 0,
    itemsGathered: 0,
  };

  constructor(config: GovernorConfig) {
    this.config = config;
    
    // Create entity manager
    this.entityManager = new YUKA.EntityManager();
    this.time = new YUKA.Time();
    
    // Create vehicle (player representation)
    this.vehicle = new YUKA.Vehicle();
    this.vehicle.position.set(config.startPosition.x, 0, config.startPosition.y);
    this.vehicle.maxSpeed = 5;
    this.vehicle.maxForce = 10;
    
    // Add to entity manager
    this.entityManager.add(this.vehicle);
    
    // Create state machine
    this.stateMachine = new YUKA.StateMachine<PlayerGovernor>(this);
    this.initializeStates();
  }

  /**
   * Initialize FSM states
   */
  private initializeStates(): void {
    const idleState = new YUKA.State<PlayerGovernor>('IDLE');
    const exploringState = new YUKA.State<PlayerGovernor>('EXPLORING');
    const movingState = new YUKA.State<PlayerGovernor>('MOVING_TO_TARGET');
    const interactingState = new YUKA.State<PlayerGovernor>('INTERACTING');
    const combatState = new YUKA.State<PlayerGovernor>('COMBAT');
    const completedState = new YUKA.State<PlayerGovernor>('COMPLETED');
    const failedState = new YUKA.State<PlayerGovernor>('FAILED');

    // Idle state
    idleState.enter = (governor) => {
      console.log('🤖 AI: Entering IDLE state');
      governor.selectNextGoal();
    };

    // Exploring state
    exploringState.enter = (governor) => {
      console.log('🤖 AI: Entering EXPLORING state');
      governor.startExploration();
    };
    
    exploringState.execute = (governor) => {
      governor.continueExploration();
    };

    // Moving to target state
    movingState.enter = (governor) => {
      console.log('🤖 AI: Entering MOVING_TO_TARGET state');
      if (governor.currentGoal?.target) {
        governor.moveToPosition(governor.currentGoal.target);
      }
    };
    
    movingState.execute = (governor) => {
      if (governor.currentGoal?.target) {
        const reached = governor.isAtTarget(governor.currentGoal.target);
        if (reached) {
          governor.stateMachine.changeTo('INTERACTING');
        }
      }
    };

    // Interacting state
    interactingState.enter = (governor) => {
      console.log('🤖 AI: Entering INTERACTING state');
      governor.performInteraction();
    };

    // Combat state
    combatState.enter = (governor) => {
      console.log('🤖 AI: Entering COMBAT state');
      governor.enterCombat();
    };
    
    combatState.execute = (governor) => {
      governor.continueCombat();
    };

    // Completed state
    completedState.enter = (governor) => {
      console.log('✅ AI: All goals completed!');
    };

    // Failed state
    failedState.enter = (governor) => {
      console.log('❌ AI: Scenario failed');
    };

    // Add states to machine
    this.stateMachine.add(idleState);
    this.stateMachine.add(exploringState);
    this.stateMachine.add(movingState);
    this.stateMachine.add(interactingState);
    this.stateMachine.add(combatState);
    this.stateMachine.add(completedState);
    this.stateMachine.add(failedState);

    // Set initial state
    this.stateMachine.changeTo('IDLE');
  }

  /**
   * Start the AI governor
   */
  public start(): void {
    this.startTime = Date.now();
    console.log(`🤖 AI Governor started for seed: ${this.config.worldSeed}`);
  }

  /**
   * Update AI governor (call every frame)
   */
  public update(delta: number): boolean {
    // Check timeout
    const elapsed = (Date.now() - this.startTime) / 1000;
    if (elapsed > this.config.maxDuration) {
      this.stateMachine.changeTo('FAILED');
      return false; // Stop updating
    }

    // Update time
    this.time.update();
    const timeDelta = this.time.getDelta();

    // Update entity manager
    this.entityManager.update(timeDelta);

    // Update state machine
    this.stateMachine.update();

    // Continue if not completed or failed
    const currentState = this.stateMachine.currentState?.name;
    return currentState !== 'COMPLETED' && currentState !== 'FAILED';
  }

  /**
   * Select next goal from queue
   */
  private selectNextGoal(): void {
    if (this.config.goals.length === 0) {
      this.stateMachine.changeTo('COMPLETED');
      return;
    }

    this.currentGoal = this.config.goals.shift() || null;
    
    if (!this.currentGoal) {
      this.stateMachine.changeTo('COMPLETED');
      return;
    }

    // Transition based on goal type
    switch (this.currentGoal.type) {
      case 'move':
        this.stateMachine.changeTo('MOVING_TO_TARGET');
        break;
      case 'explore':
        this.stateMachine.changeTo('EXPLORING');
        break;
      case 'interact':
        this.stateMachine.changeTo('MOVING_TO_TARGET');
        break;
      case 'combat':
        this.stateMachine.changeTo('COMBAT');
        break;
      case 'gather':
        this.stateMachine.changeTo('MOVING_TO_TARGET');
        break;
    }
  }

  /**
   * Move to target position
   */
  private moveToPosition(target: { x: number; y: number }): void {
    const targetPos = new YUKA.Vector3(target.x, 0, target.y);
    const seekBehavior = new YUKA.SeekBehavior(targetPos);
    this.vehicle.steering.add(seekBehavior);
  }

  /**
   * Check if at target position
   */
  private isAtTarget(target: { x: number; y: number }): boolean {
    const distance = Math.sqrt(
      Math.pow(this.vehicle.position.x - target.x, 2) +
      Math.pow(this.vehicle.position.z - target.y, 2)
    );
    return distance < 0.5; // Within 0.5 units
  }

  /**
   * Start exploration behavior
   */
  private startExploration(): void {
    const wanderBehavior = new YUKA.WanderBehavior();
    this.vehicle.steering.add(wanderBehavior);
  }

  /**
   * Continue exploration
   */
  private continueExploration(): void {
    // Check if exploration goal duration met
    if (this.currentGoal?.duration) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      if (elapsed >= this.currentGoal.duration) {
        this.markGoalCompleted();
        this.stateMachine.changeTo('IDLE');
      }
    }
  }

  /**
   * Perform interaction
   */
  private performInteraction(): void {
    console.log('🤖 AI: Performing interaction');
    this.metrics.interactionsPerformed++;
    this.markGoalCompleted();
    this.stateMachine.changeTo('IDLE');
  }

  /**
   * Enter combat
   */
  private enterCombat(): void {
    console.log('🤖 AI: Entering combat');
    this.metrics.combatEncounters++;
    // Simulate combat
    setTimeout(() => {
      this.markGoalCompleted();
      this.stateMachine.changeTo('IDLE');
    }, 2000);
  }

  /**
   * Continue combat
   */
  private continueCombat(): void {
    // Combat logic would go here
  }

  /**
   * Mark current goal as completed
   */
  private markGoalCompleted(): void {
    if (this.currentGoal) {
      this.completedGoals.push(this.currentGoal);
      this.metrics.goalsCompleted++;
      console.log(`✅ Goal completed: ${this.currentGoal.type}`);
    }
  }

  /**
   * Get current position
   */
  public getPosition(): { x: number; y: number } {
    return {
      x: this.vehicle.position.x,
      y: this.vehicle.position.z,
    };
  }

  /**
   * Get test results
   */
  public getResults() {
    return {
      completed: this.stateMachine.currentState?.name === 'COMPLETED',
      metrics: this.metrics,
      completedGoals: this.completedGoals.length,
      totalGoals: this.completedGoals.length + this.config.goals.length,
    };
  }
}
