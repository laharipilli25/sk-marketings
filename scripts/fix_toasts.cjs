const fs = require('fs');
const path = require('path');

// 1. AdminDashboard.jsx fixes
const adminPath = 'D:/SK Marketings/Frontend/src/pages/AdminDashboard.jsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');

// Fix assignInquiry
adminContent = adminContent.replace(
  'if (response.ok) {\n          fetchInquiries();\n        } else {',
  'if (response.ok) {\n          fetchInquiries();\n          toast.success("Inquiry assigned successfully!");\n        } else {'
);

// Fix updateAgentStatus
adminContent = adminContent.replace(
  'if (response.ok) {\n          fetchAgents(); // Refresh full list\n          fetchPaginatedAgents(agentsCurrentPage); // Refresh paginated view\n        } else {',
  'if (response.ok) {\n          fetchAgents(); // Refresh full list\n          fetchPaginatedAgents(agentsCurrentPage); // Refresh paginated view\n          toast.success("Agent status updated successfully!");\n        } else {'
);

// Fix toggleAgentStatus
adminContent = adminContent.replace(
  'if (response.ok) {\n          fetchAgents();\n          fetchPaginatedAgents(agentsCurrentPage);\n        } else {',
  'if (response.ok) {\n          fetchAgents();\n          fetchPaginatedAgents(agentsCurrentPage);\n          toast.success(`Agent status changed to ${newStatus}`);\n        } else {'
);

fs.writeFileSync(adminPath, adminContent);
console.log('Fixed AdminDashboard.jsx');

// 2. Profile.jsx fixes
const profilePath = 'D:/SK Marketings/Frontend/src/pages/Profile.jsx';
let profileContent = fs.readFileSync(profilePath, 'utf8');

if (!profileContent.includes("import toast")) {
  profileContent = "import toast from 'react-hot-toast';\n" + profileContent;
}

// Replace setMessage/setError calls with toast calls
profileContent = profileContent.replace(/setError\(([^)]+)\);/g, 'setError($1);\n        toast.error($1);');
profileContent = profileContent.replace(/setMessage\("Profile updated successfully!"\);/g, 'setMessage("Profile updated successfully!");\n        toast.success("Profile updated successfully!");');
profileContent = profileContent.replace(/setMessage\("Password updated successfully!"\);/g, 'setMessage("Password updated successfully!");\n        toast.success("Password updated successfully!");');

fs.writeFileSync(profilePath, profileContent);
console.log('Fixed Profile.jsx');
