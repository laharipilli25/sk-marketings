const fs = require('fs');
const path = require('path');

const files = [
  'D:/SK Marketings/Frontend/src/pages/AdminDashboard.jsx',
  'D:/SK Marketings/Frontend/src/pages/AgentDashboard.jsx',
  'D:/SK Marketings/Frontend/src/pages/Contact.jsx',
  'D:/SK Marketings/Frontend/src/pages/AdminLogin.jsx',
  'D:/SK Marketings/Frontend/src/pages/UserDashboard.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Add import if missing
  if (!content.includes("import toast")) {
    content = "import toast from 'react-hot-toast';\n" + content;
  }

  // Replace success alerts
  content = content.replace(/alert\("Agent created successfully!"\)/g, 'toast.success("Agent created successfully!")');
  content = content.replace(/alert\("Agent updated successfully!"\)/g, 'toast.success("Agent updated successfully!")');
  content = content.replace(/alert\("Lead updated successfully!"\)/g, 'toast.success("Lead updated successfully!")');
  content = content.replace(/alert\("Inquiry converted to lead successfully!"\)/g, 'toast.success("Inquiry converted to lead successfully!")');
  content = content.replace(/alert\(editingLead \? "Lead updated successfully!" : "Lead created successfully!"\)/g, 'toast.success(editingLead ? "Lead updated successfully!" : "Lead created successfully!")');

  // Replace remaining alerts with toast.error
  content = content.replace(/alert\(/g, 'toast.error(');

  fs.writeFileSync(file, content);
  console.log(`Replaced alerts in ${path.basename(file)}`);
});
