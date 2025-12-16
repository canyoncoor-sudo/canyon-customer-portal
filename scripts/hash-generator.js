// Hash Generator for Access Codes
// Usage: node scripts/hash-generator.js <access-code>

import bcrypt from 'bcryptjs';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node scripts/hash-generator.js <access-code>');
  console.log('Example: node scripts/hash-generator.js 123456');
  process.exit(1);
}

const accessCode = args[0];
const hash = bcrypt.hashSync(accessCode, 10);

console.log('\n🔐 Access Code Hash Generated\n');
console.log('Access Code:', accessCode);
console.log('Bcrypt Hash:', hash);
console.log('\n✅ Use this SQL to add the access code:\n');
console.log(`insert into public.job_access (job_id, access_code_hash, is_active)`);
console.log(`values ('YOUR_JOB_UUID_HERE', '${hash}', true);\n`);
