import { Item } from '@rpgjs/database';
import { type QuestObjective, type QuestReward, type RpgPlayer, RpgQuest } from '@rpgjs/server';

@Item({
    id: 'SQ-04-FRAG-SORROW-WATER',
    name: 'Sorrow/Water Fragment',
    description: 'A fragment imbued with sorrow and the essence of water. Potency: 3-star.',
    price: 0, // Not purchasable
    consumable: false,
    stackable: true,
    data: {
        emotion: 'Sorrow',
        element: 'Water',
        potency: 3
    }
})
export class SorrowWaterFragment {}

@Item({
    id: 'SQ-04-FRAG-AWE-WATER',
    name: 'Awe/Water Fragment',
    description: 'A fragment imbued with awe and the essence of water. Potency: 3-star.',
    price: 0, // Not purchasable
    consumable: false,
    stackable: true,
    data: {
        emotion: 'Awe',
        element: 'Water',
        potency: 3
    }
})
export class AweWaterFragment {}

@Item({
    id: 'W-ST-03',
    name: 'Hearthstone Staff',
    description: 'A staff imbued with the warmth of a hearth. INT +14. Sorrowful Cleanse also heals INT x 0.3.',
    price: 220,
    consumable: false,
    stackable: false,
    data: {
        equip: {
            weapon: true,
            class: 'Cleric',
            int: 14,
            specialEffect: 'Sorrowful Cleanse also heals INT x 0.3'
        }
    }
})
export class HearthstoneStaff {}

export default class UpstreamSecretsQuest extends RpgQuest {
    public static id: string = 'SQ-04';
    public static category: string = 'side';
    public static act: string = 'act1';
    public static level: [number, number] = [5, 7];
    public static giver: { map: string, x: number, y: number, name: string } = { map: 'millbrook', x: 30, y: 30, name: 'Fisher Tam' };
    public static trigger: string = 'MQ-03'; // Quest ID that must be complete

    constructor() {
        super();
    }

    override onStart(player: RpgPlayer) {
        player.setVariable('SQ-04_OBJ_0', true); // Objective 0: Speak with fisher
        player.showNotification('Quest Started: Upstream Secrets');
        player.addQuest(UpstreamSecretsQuest);
    }

    override onUpdate(player: RpgPlayer) {
        // Objective 1: Travel to Upstream Falls (8, 5)
        if (player.getVariable('SQ-04_OBJ_0') && !player.getVariable('SQ-04_OBJ_1')) {
            if (player.map.id === 'upstream_falls' && player.position.x >= 8 && player.position.x <= 8 && player.position.y >= 5 && player.position.y <= 5) {
                player.setVariable('SQ-04_OBJ_1', true);
                player.showNotification('Objective Complete: Travel to Upstream Falls');
            }
        }

        // Objective 2: Find hidden cave behind waterfall (walk through the falls at tile (8, 6))
        if (player.getVariable('SQ-04_OBJ_1') && !player.getVariable('SQ-04_OBJ_2')) {
            if (player.map.id === 'upstream_falls' && player.position.x === 8 && player.position.y === 6) {
                player.setVariable('SQ-04_OBJ_2', true);
                player.showNotification('Objective Complete: Find hidden cave behind waterfall');
                // Optionally, teleport player to the grotto map or trigger a scene
                // player.changeMap('dissolved_memory_grotto');
            }
        }

        // Objective 3: Navigate dissolved memory grotto (3 rooms, light puzzle: broadcast fragments into 2 Resonance Stones to illuminate the path)
        // This objective would typically be completed by interacting with specific Resonance Stones or reaching a certain point in the grotto map.
        // For this example, we'll assume a simple trigger for reaching the end of the grotto.
        if (player.getVariable('SQ-04_OBJ_2') && !player.getVariable('SQ-04_OBJ_3')) {
            // Example: Player reaches a specific tile in the grotto map
            if (player.map.id === 'dissolved_memory_grotto' && player.getVariable('grotto_puzzle_solved')) { // 'grotto_puzzle_solved' would be set by map events
                player.setVariable('SQ-04_OBJ_3', true);
                player.showNotification('Objective Complete: Navigate dissolved memory grotto');
            }
        }

        // Objective 4: Collect 2 high-potency fragments at the grotto's end
        // This objective would be completed when the player picks up specific items.
        if (player.getVariable('SQ-04_OBJ_3') && !player.getVariable('SQ-04_OBJ_4')) {
            // Assuming these fragments are added to inventory and a variable is set upon collection
            if (player.getVariable('collected_grotto_fragment_1') && player.getVariable('collected_grotto_fragment_2')) {
                player.setVariable('SQ-04_OBJ_4', true);
                player.showNotification('Objective Complete: Collect 2 high-potency fragments');
            }
        }

        // Objective 5: Return to fisher
        if (player.getVariable('SQ-04_OBJ_4') && !player.getVariable('SQ-04_OBJ_5')) {
            if (player.map.id === UpstreamSecretsQuest.giver.map && player.position.x === UpstreamSecretsQuest.giver.x && player.position.y === UpstreamSecretsQuest.giver.y) {
                player.setVariable('SQ-04_OBJ_5', true);
                player.showNotification('Objective Complete: Return to fisher');
                this.onComplete(player);
            }
        }
    }

    override onComplete(player: RpgPlayer) {
        player.showNotification('Quest Completed: Upstream Secrets');
        player.removeQuest(UpstreamSecretsQuest);

        // Rewards
        player.addGold(180);
        player.addItem(SorrowWaterFragment, 1);
        player.addItem(AweWaterFragment, 1);
        player.addItem(HearthstoneStaff, 1);

        // Completion Dialogue
        player.callMapMethod(UpstreamSecretsQuest.giver.map, 'showDialogue', [
            UpstreamSecretsQuest.giver.name,
            "You went behind the falls? And came back? The last person who tried that was my grandmother. She said the cave sang to her. Glad to know it's still singing."
        ]);

        // Clean up quest variables (optional, but good practice)
        player.setVariable('SQ-04_OBJ_0', false);
        player.setVariable('SQ-04_OBJ_1', false);
        player.setVariable('SQ-04_OBJ_2', false);
        player.setVariable('SQ-04_OBJ_3', false);
        player.setVariable('SQ-04_OBJ_4', false);
        player.setVariable('SQ-04_OBJ_5', false);
        player.setVariable('grotto_puzzle_solved', false); // Reset grotto state
        player.setVariable('collected_grotto_fragment_1', false);
        player.setVariable('collected_grotto_fragment_2', false);
    }

    override onCanStart(player: RpgPlayer): boolean {
        const mq03Complete = player.getQuest('MQ-03')?.isCompleted;
        const playerLevel = player.level;
        const [minLevel, maxLevel] = UpstreamSecretsQuest.level;

        return mq03Complete && playerLevel >= minLevel && playerLevel <= maxLevel;
    }

    override onGetObjectives(player: RpgPlayer): QuestObjective[] {
        const objectives: QuestObjective[] = [];

        if (!player.getVariable('SQ-04_OBJ_0')) {
            objectives.push({ text: 'Speak with Fisher Tam at Fisher\'s Rest (30, 30) in Millbrook', isChecked: false });
        } else {
            objectives.push({ text: 'Speak with Fisher Tam at Fisher\'s Rest (30, 30) in Millbrook', isChecked: true });
        }

        if (player.getVariable('SQ-04_OBJ_0') && !player.getVariable('SQ-04_OBJ_1')) {
            objectives.push({ text: 'Travel to Upstream Falls (8, 5)', isChecked: false });
        } else if (player.getVariable('SQ-04_OBJ_1')) {
            objectives.push({ text: 'Travel to Upstream Falls (8, 5)', isChecked: true });
        }

        if (player.getVariable('SQ-04_OBJ_1') && !player.getVariable('SQ-04_OBJ_2')) {
            objectives.push({ text: 'Find the hidden cave behind the waterfall (walk through the falls at tile (8, 6))', isChecked: false });
        } else if (player.getVariable('SQ-04_OBJ_2')) {
            objectives.push({ text: 'Find the hidden cave behind the waterfall (walk through the falls at tile (8, 6))', isChecked: true });
        }

        if (player.getVariable('SQ-04_OBJ_2') && !player.getVariable('SQ-04_OBJ_3')) {
            objectives.push({ text: 'Navigate the dissolved memory grotto', isChecked: false });
        } else if (player.getVariable('SQ-04_OBJ_3')) {
            objectives.push({ text: 'Navigate the dissolved memory grotto', isChecked: true });
        }

        if (player.getVariable('SQ-04_OBJ_3') && !player.getVariable('SQ-04_OBJ_4')) {
            objectives.push({ text: 'Collect 2 high-potency fragments at the grotto\'s end', isChecked: false });
        } else if (player.getVariable('SQ-04_OBJ_4')) {
            objectives.push({ text: 'Collect 2 high-potency fragments at the grotto\'s end', isChecked: true });
        }

        if (player.getVariable('SQ-04_OBJ_4') && !player.getVariable('SQ-04_OBJ_5')) {
            objectives.push({ text: 'Return to Fisher Tam at Fisher\'s Rest (30, 30) in Millbrook', isChecked: false });
        } else if (player.getVariable('SQ-04_OBJ_5')) {
            objectives.push({ text: 'Return to Fisher Tam at Fisher\'s Rest (30, 30) in Millbrook', isChecked: true });
        }

        return objectives;
    }

    override onGetRewards(player: RpgPlayer): QuestReward[] {
        return [
            { item: 'gold', quantity: 180 },
            { item: SorrowWaterFragment, quantity: 1 },
            { item: AweWaterFragment, quantity: 1 },
            { item: HearthstoneStaff, quantity: 1 }
        ];
    }
}