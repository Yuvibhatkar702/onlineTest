const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting build process...');

try {
  // Install server dependencies
  console.log('📦 Installing server dependencies...');
  process.chdir(path.join(__dirname, 'server'));
  execSync('npm ci --only=production', { stdio: 'inherit' });

  // Install client dependencies and build
  console.log('📦 Installing client dependencies...');
  process.chdir(path.join(__dirname, 'client'));
  execSync('npm ci', { stdio: 'inherit' });

  console.log('🏗️ Building React application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
