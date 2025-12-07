
export interface N8nNode {
    parameters: any;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    id?: string;
}

export interface N8nConnection {
    node: string;
    type: string;
    index: number;
}

export interface N8nWorkflowData {
    nodes: N8nNode[];
    connections: { [key: string]: { main: N8nConnection[][] } };
}

export interface WorkflowAnalysisResult {
    isValid: boolean;
    nodeCount: number;
    complexity: 'simple' | 'medium' | 'complex';
    issues: string[];
    nodesByType: { [key: string]: number };
}

export const n8nService = {
    parseWorkflow(jsonString: string): N8nWorkflowData | null {
        try {
            const data = JSON.parse(jsonString);
            if (!data.nodes || !data.connections) {
                throw new Error("Invalid n8n workflow format");
            }
            return data as N8nWorkflowData;
        } catch (error) {
            console.error("Error parsing n8n workflow:", error);
            return null;
        }
    },

    analyzeWorkflow(workflow: N8nWorkflowData): WorkflowAnalysisResult {
        const issues: string[] = [];
        const nodesByType: { [key: string]: number } = {};

        // Analyze nodes
        workflow.nodes.forEach(node => {
            nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;

            // Check for unnamed nodes (default names often indicate lack of documentation)
            if (node.name.startsWith('Set') || node.name.startsWith('HTTP Request')) {
                // This is a weak check, but serves as an example
            }
        });

        // Check for disconnected nodes (simplified check)
        const connectedNodeNames = new Set<string>();
        Object.keys(workflow.connections).forEach(sourceNode => {
            connectedNodeNames.add(sourceNode);
            const outputConnections = workflow.connections[sourceNode].main;
            if (outputConnections) {
                outputConnections.forEach(connectionGroup => {
                    connectionGroup.forEach(conn => {
                        connectedNodeNames.add(conn.node);
                    });
                });
            }
        });

        workflow.nodes.forEach(node => {
            // Start nodes might not be targets, but most others should be connected
            if (!connectedNodeNames.has(node.name) && node.type !== 'n8n-nodes-base.start') {
                // This logic is imperfect because 'main' isn't the only connection type, but good for a basic check
                // issues.push(`Node "${node.name}" appears to be disconnected.`);
            }
        });

        // Determine complexity
        const nodeCount = workflow.nodes.length;
        let complexity: 'simple' | 'medium' | 'complex' = 'simple';
        if (nodeCount > 10) complexity = 'medium';
        if (nodeCount > 30) complexity = 'complex';

        // Check for Error Trigger
        const hasErrorTrigger = workflow.nodes.some(n => n.type.includes('errorTrigger'));
        if (!hasErrorTrigger && complexity !== 'simple') {
            issues.push("Complex workflow missing Error Trigger node for robust error handling.");
        }

        return {
            isValid: issues.length === 0, // Strict validity vs just having issues
            nodeCount,
            complexity,
            issues,
            nodesByType
        };
    }
};
