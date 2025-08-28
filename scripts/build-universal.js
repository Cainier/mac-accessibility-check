const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const os = require('os');

const buildDir = path.resolve(__dirname, '../build');
const tempDir = path.join(os.tmpdir(), 'mac-accessibility-check-build');
const arm64Dir = path.join(tempDir, 'arm64');
const x64Dir = path.join(buildDir, 'x64');
const releaseDir = path.join(buildDir, 'Release');

function run(cmd, env = {}) {
  console.log('Running:', cmd);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
}

function findNodeFile(dir) {
  console.log(`Looking for .node files in: ${dir}`);
  const files = glob.sync(path.join(dir, '**/*.node'));
  console.log(`Found files:`, files);
  if (!files.length) throw new Error(`Cannot find .node file in ${dir}`);
  return files[0];
}

// 清理旧文件
run('node-gyp clean');
fs.rmSync(buildDir, { recursive: true, force: true });
fs.rmSync(tempDir, { recursive: true, force: true });

// 构建 arm64
console.log('Building for arm64...');
run('node-gyp rebuild --arch=arm64 --build-from-source');
console.log(`Creating arm64 directory: ${arm64Dir}`);
fs.mkdirSync(arm64Dir, { recursive: true });
console.log(`Arm64 directory created: ${fs.existsSync(arm64Dir)}`);
const arm64Node = findNodeFile(path.join(buildDir, 'Release'));
console.log(`Arm64 node file found at: ${arm64Node}`);
const arm64DestPath = path.join(arm64Dir, 'access_check.node');
fs.copyFileSync(arm64Node, arm64DestPath);
console.log(`Arm64 node file copied to: ${arm64DestPath}`);
console.log(`Arm64 file exists after copy: ${fs.existsSync(arm64DestPath)}`);

// 构建 x64
console.log('Building for x64...');
run('arch -x86_64 node-gyp rebuild --arch=x64 --build-from-source');
console.log(`Creating x64 directory: ${x64Dir}`);
fs.mkdirSync(x64Dir, { recursive: true });
const x64Node = findNodeFile(path.join(buildDir, 'Release'));
console.log(`X64 node file found at: ${x64Node}`);
const x64DestPath = path.join(x64Dir, 'access_check.node');
fs.copyFileSync(x64Node, x64DestPath);
console.log(`X64 node file copied to: ${x64DestPath}`);

// 验证文件存在
console.log('Verifying files exist...');
console.log(`Arm64 file exists: ${fs.existsSync(arm64DestPath)}`);
console.log(`X64 file exists: ${fs.existsSync(x64DestPath)}`);

// 生成 universal binary
console.log('Creating universal binary...');
fs.mkdirSync(releaseDir, { recursive: true });
const universalNode = path.join(releaseDir, 'accessibility_check.node');
run(`lipo -create "${arm64DestPath}" "${x64DestPath}" -output "${universalNode}"`);

console.log('Universal binary created at:', universalNode);

// 清理临时文件
fs.rmSync(tempDir, { recursive: true, force: true });
