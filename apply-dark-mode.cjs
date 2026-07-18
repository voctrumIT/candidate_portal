const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./app');

files.forEach(filePath => {
  // skip dashboard layout/page since I already did those, and we did profile/components
  if (filePath.includes('app\\\\dashboard\\\\layout.tsx') || filePath.includes('app/dashboard/layout.tsx')) return;
  if (filePath.includes('app\\\\dashboard\\\\page.tsx') || filePath.includes('app/dashboard/page.tsx')) return;
  if (filePath.includes('app\\\\dashboard\\\\my-jobs\\\\page.tsx') || filePath.includes('app/dashboard/my-jobs/page.tsx')) return;
  if (filePath.includes('app\\\\dashboard\\\\my-jobs\\\\components') || filePath.includes('app/dashboard/my-jobs/components')) return;
  if (filePath.includes('app\\\\dashboard\\\\profile\\\\page.tsx') || filePath.includes('app/dashboard/profile/page.tsx')) return;
  if (filePath.includes('app\\\\dashboard\\\\profile\\\\components') || filePath.includes('app/dashboard/profile/components')) return;
  if (filePath.includes('app\\\\dashboard\\\\notifications\\\\page.tsx') || filePath.includes('app/dashboard/notifications/page.tsx')) return;
  if (filePath.includes('app\\\\dashboard\\\\settings') || filePath.includes('app/dashboard/settings')) return;
  if (filePath.includes('app\\\\jobs\\\\components\\\\JobCard.tsx') || filePath.includes('app/jobs/components/JobCard.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/bg-white(?!\/)/g, 'bg-white dark:bg-[#1a1a1a]');
  content = content.replace(/text-\[#101828\]/g, 'text-[#101828] dark:text-white');
  content = content.replace(/text-\[#667085\]/g, 'text-[#667085] dark:text-slate-400');
  content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
  content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
  content = content.replace(/bg-slate-50(?!\/)/g, 'bg-slate-50 dark:bg-slate-900');
  content = content.replace(/bg-\[#f9fafb\]/g, 'bg-[#f9fafb] dark:bg-slate-900');
  
  content = content.replace(/dark:bg-\[#1a1a1a\] dark:bg-\[#1a1a1a\]/g, 'dark:bg-[#1a1a1a]');
  content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');
  content = content.replace(/dark:text-slate-400 dark:text-slate-400/g, 'dark:text-slate-400');

  fs.writeFileSync(filePath, content);
});
console.log('Applied dark mode to ' + files.length + ' files');
