#!/bin/bash
#
# deploydemo.sh - 演示环境一键部署脚本
# 在 /dev/shm 独立目录构建演示环境产物，完全不触及本地 .next，
# 确保演示环境链接正确且不影响本地 deploy.sh 部署的服务。
#
set -euo pipefail

# ==================== 演示环境配置（可通过环境变量覆盖） ====================
DEMO_HOST="${DEMO_HOST:-demo2.zhiyu.com.cn}"
DEMO_USER="${DEMO_USER:-root}"
DEMO_PASS="${DEMO_PASS:-lEL9cHcBQMjCEqp6}"
OLD_IP="${OLD_IP:-111.170.170.202}"

# ==================== 项目配置（每个项目只需改这里） ====================
SITE_NAME="registrar"
PORT=3007

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_BASE="/var/www"
REMOTE_DIR="$REMOTE_BASE/$SITE_NAME"
DEMO_BUILD_DIR="/dev/shm/${SITE_NAME}-demo-build"
SSH_PORT="${SSH_PORT:-22}"

# 安全提示
if [ -z "${DEMO_PASS:-}" ]; then
  echo "❌ 错误：未设置 DEMO_PASS 环境变量且脚本默认密码为空"
  exit 1
fi

# 检查 sshpass
if ! command -v sshpass &>/dev/null; then
  echo "❌ 未检测到 sshpass，请先安装："
  echo "   Debian/Ubuntu: sudo apt-get install -y sshpass"
  echo "   macOS:         brew install hudochenkov/sshpass/sshpass"
  exit 1
fi

# 通过环境变量传密码，避免出现在进程列表
export SSHPASS="$DEMO_PASS"
SSH_CMD="sshpass -e ssh"
SCP_CMD="sshpass -e scp"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -p $SSH_PORT"

cd "$SCRIPT_DIR"

# ==================== IP 替换与还原 ====================
backup_files=()

replace_ip() {
  local old="$1" new="$2"
  local files
  local old_pattern
  old_pattern=$(sed 's/\./\\./g' <<< "$old")

  mapfile -t files < <(grep -rlF \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist \
    --exclude='*.demo-bak' \
    --exclude='deploydemo.sh' \
    --exclude='deploy.sh' \
    --exclude='deploycom.sh' \
    --exclude='deploy.ps1' \
    --exclude='*.tar.gz' \
    "$old" . 2>/dev/null || true)

  for f in "${files[@]}"; do
    if [ -f "$f" ]; then
      cp "$f" "$f.demo-bak"
      backup_files+=("$f")
      sed -i "s/$old_pattern/$new/g" "$f"
      echo "  已替换: $f"
    fi
  done
}

restore_ip() {
  if [ ${#backup_files[@]} -eq 0 ]; then
    return 0
  fi
  echo ""
  echo ">>> 还原源码中的 IP 配置..."
  for f in "${backup_files[@]}"; do
    if [ -f "$f.demo-bak" ]; then
      mv "$f.demo-bak" "$f"
      echo "  已还原: $f"
    fi
  done
}

# 脚本退出时还原源码 IP 并清理临时构建目录
cleanup() {
  restore_ip
  if [ -d "$DEMO_BUILD_DIR" ]; then
    echo ">>> 清理临时构建目录 $DEMO_BUILD_DIR ..."
    rm -rf "$DEMO_BUILD_DIR"
  fi
}
trap 'cleanup' EXIT

# 清理上次残留的备份文件
find . -maxdepth 3 -name '*.demo-bak' -type f -delete 2>/dev/null || true

# ==================== 主流程 ====================
echo ""
echo "🚀 启动演示环境部署: [$SITE_NAME] -> http://$DEMO_HOST:$PORT"
echo ""

echo "[1/5] 复制源码到临时构建目录 $DEMO_BUILD_DIR ..."
rm -rf "$DEMO_BUILD_DIR"
mkdir -p "$DEMO_BUILD_DIR"
rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='*.demo-bak' \
  --exclude='*.log' \
  --exclude='logs/' \
  "$SCRIPT_DIR/" "$DEMO_BUILD_DIR/"

# 链接 node_modules，避免复制大目录
# 注意：此链接仅在构建阶段使用，构建完成后会删除，防止 rsync 到远程时带上指向本地的符号链接
ln -s "$SCRIPT_DIR/node_modules" "$DEMO_BUILD_DIR/node_modules"

cd "$DEMO_BUILD_DIR"

echo ""
echo "[2/5] 替换源码中的旧 IP ($OLD_IP -> $DEMO_HOST)..."
replace_ip "$OLD_IP" "$DEMO_HOST"

echo ""
echo "[3/5] 安装依赖并构建（使用 webpack 以绕过 Turbopack standalone 问题）..."
if [ ! -d "node_modules" ] || [ "${FORCE_INSTALL:-0}" = "1" ]; then
  echo "node_modules 不存在，需要在原项目目录安装依赖"
  exit 1
fi
pnpm exec next build --webpack

echo ""
echo "[4/5] 组装 standalone 产物..."
STANDALONE_DIR="$DEMO_BUILD_DIR/.next/standalone"
STATIC_DIR="$DEMO_BUILD_DIR/.next/static"
PUBLIC_DIR="$DEMO_BUILD_DIR/public"
SERVER_DIR="$DEMO_BUILD_DIR/.next/server"

if [ -d "$SERVER_DIR" ]; then
  mkdir -p "$STANDALONE_DIR/.next/server"
  rsync -a --delete --exclude="*.map" "$SERVER_DIR/" "$STANDALONE_DIR/.next/server/"
fi
if [ -d "$STATIC_DIR" ]; then
  mkdir -p "$STANDALONE_DIR/.next/static"
  rsync -a --delete --exclude="*.map" "$STATIC_DIR/" "$STANDALONE_DIR/.next/static/"
fi
if [ -d "$PUBLIC_DIR" ]; then
  mkdir -p "$STANDALONE_DIR/public"
  rsync -a --delete --exclude="*.map" "$PUBLIC_DIR/" "$STANDALONE_DIR/public/"
fi

# 复制 data 目录中的配置（如平台链接等）
if [ -d "$DEMO_BUILD_DIR/data" ]; then
  echo ">>> 复制 data 目录..."
  rsync -a "$DEMO_BUILD_DIR/data/" "$STANDALONE_DIR/data/"
fi

# 删除构建时使用的根目录 node_modules 符号链接，避免 rsync 到远程后形成无效链接
if [ -L "$DEMO_BUILD_DIR/node_modules" ]; then
  rm -f "$DEMO_BUILD_DIR/node_modules"
fi

echo ""
echo "[5/5] 上传并部署到演示服务器 $DEMO_HOST..."

$SSH_CMD $SSH_OPTS "$DEMO_USER@$DEMO_HOST" \
  "rm -rf $REMOTE_DIR && mkdir -p $REMOTE_DIR && chown $DEMO_USER:$DEMO_USER $REMOTE_DIR"

rsync -az --delete \
  -e "$SSH_CMD $SSH_OPTS" \
  --timeout=300 \
  --exclude='*.map' \
  --exclude='*.log' \
  --exclude='logs/' \
  "$STANDALONE_DIR/" \
  "$DEMO_USER@$DEMO_HOST:$REMOTE_DIR/"

$SSH_CMD $SSH_OPTS "$DEMO_USER@$DEMO_HOST" \
  "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" << 'REMOTE_EOF'
  set -e
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  NODE_BIN=$(command -v node || echo "/usr/local/bin/node")
  if [ ! -x "$NODE_BIN" ]; then
    echo "❌ 远程服务器未找到 node，请先安装 Node.js"
    exit 1
  fi

  if ! command -v pm2 &>/dev/null; then
    echo ">>> 远程安装 pm2..."
    "$NODE_BIN" "$(command -v npm || echo '/usr/local/bin/npm')" install -g pm2
  fi

  pm2 delete "$SITE_NAME" &>/dev/null || true

  cd "$REMOTE_DIR"

  PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
    --name "$SITE_NAME" \
    --interpreter "$NODE_BIN" \
    --restart-delay 3000

  pm2 save > /dev/null
REMOTE_EOF

$SSH_CMD $SSH_OPTS "$DEMO_USER@$DEMO_HOST" \
  "pm2 restart '$SITE_NAME' --update-env" >/dev/null 2>&1 || true

echo ""
echo "✨ [$SITE_NAME] 演示环境部署完成！"
echo "   访问地址: http://$DEMO_HOST:$PORT"
echo ""
