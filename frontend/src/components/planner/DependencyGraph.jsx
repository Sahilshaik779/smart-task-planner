import React, { useEffect, useId } from 'react';
import mermaid from 'mermaid';

const generateMermaidGraph = (tasks) => {
    let graph = 'graph TD;\n'; 

    tasks.forEach(task => {
       
        const taskName = task.name.replace(/"/g, '#quot;');
        graph += `    ${task.temp_id}["<div style='font-weight:bold; margin-bottom: 5px;'>${task.temp_id}</div>${taskName}"];\n`;
    });

    tasks.forEach(task => {
        if (task.dependencies && task.dependencies.length > 0) {
            task.dependencies.forEach(dep => {
                graph += `    ${dep} --> ${task.temp_id};\n`;
            });
        }
    });

    return graph;
};

export const DependencyGraph = ({ tasks }) => {
    const graphId = `mermaid-graph-${useId()}`;
    const mermaidSyntax = generateMermaidGraph(tasks);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true, theme: 'base', themeVariables: {
            primaryColor: '#f3f4f6',
            primaryTextColor: '#1e293b', 
            lineColor: '#64748b', 
            fontSize: '14px',
        }});
        
        const renderGraph = async () => {
            try {
                const { svg } = await mermaid.render(graphId, mermaidSyntax);
                const graphDiv = document.getElementById(graphId);
                if (graphDiv) {
                    graphDiv.innerHTML = svg;
                }
            } catch (error) {
                console.error("Mermaid rendering error:", error);
            }
        };
        renderGraph();
    }, [mermaidSyntax, graphId]);

    return <div id={graphId} className="w-full flex justify-center p-4 bg-white rounded-xl shadow-md"></div>;
};