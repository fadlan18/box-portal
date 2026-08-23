#!/bin/bash
set -e
cd /home/authserv/box-portal

echo "🔨 Building image..."
buildah bud -t mitranz-portal:latest .

echo "📦 Exporting image..."
rm -f /tmp/mitranz-portal-docker.tar
buildah push mitranz-portal:latest docker-archive:/tmp/mitranz-portal-docker.tar

echo "📥 Importing to K3s..."
k3s ctr images import /tmp/mitranz-portal-docker.tar

echo "🚀 Deploying..."
kubectl set env deployment/mitranz-portal -n box-portal \
  JWT_SECRET="miTRANZ-JWT-Secret-2024-SuperSecure!" \
  HASURA_GRAPHQL_URL="http://hasura-box.box-portal.svc.cluster.local:8080/v1/graphql" \
  HASURA_ADMIN_SECRET="vmpdfO2IZOwM1QLBFict1YJmAX3LlwX2" \
  DIGIFLAZZ_USERNAME="vasozegqnwpo" \
  DIGIFLAZZ_API_KEY="ee1255a9-d729-51cb-a8f3-47d5b5e5ac4b" \
  TELEGRAM_BOT_TOKEN="8909431259:AAHvW_obBlsWZKlbIzXiO0IKEPILAXzIs3M" \
  TELEGRAM_CHAT_ID="-1004397730203" \
  SMTP_HOST="smtp-relay-mitranz.mitranz-mail.svc.cluster.local" \
  SMTP_PORT="25" \
  SMTP_USER="mitranz@localdomain" \
  SMTP_PASS="RelayPassMitraNZ123!" \
  APP_URL="https://mitranz.com"

kubectl set env deployment/mitranz-portal -n box-portal \
  REDIS_URL='redis://:RedisBox2024!@redis-box.box-portal.svc.cluster.local:6379' \
  'SMTP_FROM=miTRANZ <noreply@mitranz.com>'

kubectl rollout restart deployment/mitranz-portal -n box-portal
kubectl rollout status deployment/mitranz-portal -n box-portal

echo ""
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://mitranz.com 2>/dev/null || echo "000")
echo "✅ Deploy selesai!"
echo "Status: $STATUS"
