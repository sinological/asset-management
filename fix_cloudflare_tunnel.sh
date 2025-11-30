#!/bin/bash

set -e

# ==== 配置部分 ====
TUNNEL_NAME="backend-tunnel"
HOSTNAME="api.szmg.xyz"
LOCAL_SERVICE="http://localhost:3000"
CLOUDFLARED_PATH=$(which cloudflared)
CONFIG_FILE="/etc/cloudflared/config.yml"
CREDENTIALS_DIR="$HOME/.cloudflared"

# ==== 1. 备份旧证书 ====
if [ -f "$CREDENTIALS_DIR/cert.pem" ]; then
    echo "[*] 备份旧证书 cert.pem"
    mv "$CREDENTIALS_DIR/cert.pem" "$CREDENTIALS_DIR/cert.pem.backup_$(date +%s)"
fi

# ==== 2. 登录 Cloudflare ====
echo "[*] 登录 Cloudflare"
$CLOUDFLARED_PATH tunnel login

# ==== 3. 创建 Tunnel ====
echo "[*] 创建新的 Tunnel"
TUNNEL_JSON=$($CLOUDFLARED_PATH tunnel create $TUNNEL_NAME | grep "Tunnel credentials written" | awk '{print $6}')
echo "[*] Tunnel 凭证文件: $TUNNEL_JSON"

# ==== 4. 提示 DNS 处理 ====
echo "[*] 请登录 Cloudflare DNS 删除或修改 $HOSTNAME 的 A/AAAA/CNAME 记录后再按回车继续"
read -p "按回车继续 ..."

# ==== 5. 创建配置文件 ====
echo "[*] 生成 /etc/cloudflared/config.yml"
sudo mkdir -p /etc/cloudflared
sudo tee $CONFIG_FILE > /dev/null <<EOL
tunnel: $TUNNEL_NAME
credentials-file: $TUNNEL_JSON

ingress:
  - hostname: $HOSTNAME
    service: $LOCAL_SERVICE
  - service: http_status:404
EOL

# ==== 6. 注册 systemd 服务并启动 ====
echo "[*] 注册 systemd 服务"
sudo $CLOUDFLARED_PATH service install || true
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

echo "[*] 完成！"
echo "[*] 验证 Tunnel: sudo systemctl status cloudflared"
echo "[*] 后端 URL: https://$HOSTNAME/"
