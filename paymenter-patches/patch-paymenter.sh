#!/bin/bash
POD=$(kubectl get pods -n paymenter -l app=paymenter -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ -z "$POD" ]; then exit 0; fi

# Fix .env
kubectl exec -n paymenter $POD -- sh -c "
python3 << 'PYEOF'
with open('/app/var/.env', 'r') as f:
    lines = f.readlines()
lines = [l for l in lines if not l.startswith('APP_URL=') and not l.startswith('ASSET_URL=')]
for i, l in enumerate(lines):
    if l.startswith('APP_NAME='):
        lines.insert(i+1, 'APP_URL=https://paymen.mitranz.com\n')
        lines.insert(i+2, 'ASSET_URL=https://paymen.mitranz.com\n')
        break
with open('/app/var/.env', 'w') as f:
    f.writelines(lines)
PYEOF
php artisan config:cache 2>/dev/null
" 2>/dev/null

# Fix ProxyMiddleware
kubectl exec -n paymenter $POD -- sh -c "
cat > /app/app/Http/Middleware/ProxyMiddleware.php << 'PHPEOF'
<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class ProxyMiddleware
{
    protected \\\$headers = Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_PREFIX |
        Request::HEADER_X_FORWARDED_AWS_ELB;

    public function handle(Request \\\$request, Closure \\\$next): Response
    {
        \\\$request->setTrustedProxies(['127.0.0.1', \\\$request->server->get('REMOTE_ADDR')], \\\$this->headers);
        return \\\$next(\\\$request);
    }
}
PHPEOF
" 2>/dev/null

# Fix nginx
kubectl exec -n paymenter $POD -- sh -c "
sed -i 's/server_name _;/server_name paymen.mitranz.com;/' /etc/nginx/http.d/default.conf
grep -q 'SERVER_NAME paymen' /etc/nginx/http.d/default.conf || \
  sed -i '/fastcgi_param HTTP_PROXY/a\\        fastcgi_param SERVER_NAME paymen.mitranz.com;\n        fastcgi_param HTTPS on;\n        fastcgi_param HTTP_X_FORWARDED_PROTO https;\n        fastcgi_param HTTP_X_FORWARDED_HOST paymen.mitranz.com;' /etc/nginx/http.d/default.conf
nginx -t && nginx -s reload 2>/dev/null
" 2>/dev/null
