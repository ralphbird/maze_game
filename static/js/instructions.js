const INSTRUCTION_TYPES = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

const INSTRUCTION_ICONS = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
};

const InstructionManager = {
    instructions: [],
    queueElement: null,
    sortable: null,

    init() {
        this.queueElement = document.getElementById('instruction-queue');
        this.setupButtons();
        this.setupSortable();
    },

    setupButtons() {
        document.getElementById('btn-up').addEventListener('click', () => {
            this.addInstruction(INSTRUCTION_TYPES.UP);
        });

        document.getElementById('btn-down').addEventListener('click', () => {
            this.addInstruction(INSTRUCTION_TYPES.DOWN);
        });

        document.getElementById('btn-left').addEventListener('click', () => {
            this.addInstruction(INSTRUCTION_TYPES.LEFT);
        });

        document.getElementById('btn-right').addEventListener('click', () => {
            this.addInstruction(INSTRUCTION_TYPES.RIGHT);
        });
    },

    setupSortable() {
        if (this.queueElement) {
            this.sortable = Sortable.create(this.queueElement, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: () => {
                    this.updateInstructionsFromDOM();
                }
            });
        }
    },

    addInstruction(type) {
        const instruction = {
            id: this.generateId(),
            type: type
        };

        this.instructions.push(instruction);
        this.renderInstruction(instruction);
    },

    renderInstruction(instruction) {
        const item = document.createElement('div');
        item.className = 'instruction-item';
        item.dataset.id = instruction.id;
        item.innerHTML = `
            <span class="arrow">${INSTRUCTION_ICONS[instruction.type]}</span>
            <button class="delete-btn" aria-label="Delete instruction">×</button>
        `;

        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeInstruction(instruction.id);
        });

        this.queueElement.appendChild(item);
    },

    removeInstruction(id) {
        this.instructions = this.instructions.filter(inst => inst.id !== id);
        const element = this.queueElement.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.remove();
        }
    },

    updateInstructionsFromDOM() {
        const elements = this.queueElement.querySelectorAll('.instruction-item');
        const newOrder = [];

        elements.forEach(element => {
            const id = element.dataset.id;
            const instruction = this.instructions.find(inst => inst.id === id);
            if (instruction) {
                newOrder.push(instruction);
            }
        });

        this.instructions = newOrder;
    },

    getInstructions() {
        return [...this.instructions];
    },

    clear() {
        this.instructions = [];
        this.queueElement.innerHTML = '';
    },

    generateId() {
        return `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    render() {
        this.queueElement.innerHTML = '';
        this.instructions.forEach(instruction => {
            this.renderInstruction(instruction);
        });
    }
};
