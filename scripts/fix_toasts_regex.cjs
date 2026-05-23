const fs = require('fs');

const adminPath = 'D:/SK Marketings/Frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(adminPath, 'utf8');

// For toggleAgentStatus
content = content.replace(
  /if \(response\.ok\) \{\s*fetchAgents\(\);\s*\/\/\s*Refresh full list\s*fetchPaginatedAgents\(agentsCurrentPage\);\s*\/\/\s*Refresh paginated view\s*\}/,
  'if (response.ok) {\n        toast.success(`Agent status changed successfully`);\n        fetchAgents(); // Refresh full list\n        fetchPaginatedAgents(agentsCurrentPage); // Refresh paginated view\n      }'
);

// For updateAgentStatus
content = content.replace(
  /if \(response\.ok\) \{\s*fetchAgents\(\);\s*\/\/\s*Refresh full list\s*fetchPaginatedAgents\(agentsCurrentPage\);\s*\/\/\s*Refresh paginated view\s*\} else \{/,
  'if (response.ok) {\n        toast.success("Agent status updated successfully!");\n        fetchAgents(); // Refresh full list\n        fetchPaginatedAgents(agentsCurrentPage); // Refresh paginated view\n      } else {'
);

fs.writeFileSync(adminPath, content);
console.log('AdminDashboard patched with regex');
