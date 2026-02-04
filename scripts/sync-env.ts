import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ENV_FILE = path.join(process.cwd(), '.env');

if (!fs.existsSync(ENV_FILE)) {
  console.error('❌ No .env file found at root.');
  process.exit(1);
}

const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
const envVars = envContent
  .split('\n')
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [key, ...rest] = line.split('=');
    let value = rest.join('=');
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    return { key: key.trim(), value: value.trim() };
  });

console.warn(`🚀 Syncing ${envVars.length} environment variables to Vercel...`);

envVars.forEach(({ key, value }) => {
  if (!key || !value) {
    return;
  }

  try {
    // Check if exists
    // Note: Vercel CLI doesn't have a simple "check" command that returns non-zero,
    // so we try to remove it first to ensure we set the new value, or just add.
    // Simpler approach: rm then add.

    console.warn(`\n🔄 Processing ${key}...`);

    try {
      execSync(`vercel env rm ${key} production -y`, { stdio: 'ignore' });
      execSync(`vercel env rm ${key} preview -y`, { stdio: 'ignore' });
      execSync(`vercel env rm ${key} development -y`, { stdio: 'ignore' });
    } catch {
      // Ignore errors if var didn't exist
    }

    // Add to all environments
    // piping value to stdin is safer for special chars
    execSync(`printf "${value}" | vercel env add ${key} production`, { stdio: 'inherit' });
    execSync(`printf "${value}" | vercel env add ${key} preview`, { stdio: 'inherit' });
    execSync(`printf "${value}" | vercel env add ${key} development`, { stdio: 'inherit' });

    console.warn(`✅ Synced ${key}`);
  } catch (error) {
    console.error(`❌ Failed to sync ${key}`, error);
  }
});

console.warn('\n✨ All Done!');
