const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleLoginUser = \(updatedUser: Partial<UserProfile>\) => \{[^]*?setUser\(\(prev\) => \(\{[^]*?\.\.\.mergedUser,[^]*?\}\)\);\s*\};/g,
  `const handleLoginUser = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
      userLevel: updatedUser.userLevel || 'customer',
      role: updatedUser.role || 'customer',
      vipTier: updatedUser.vipTier || 'Customer',
    }));
  };`
);

fs.writeFileSync('src/App.tsx', code);
