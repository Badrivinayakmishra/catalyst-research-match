#!/bin/bash
# Monitor Render deployment and alert when it updates

echo "🔍 Monitoring Render deployment at catalyst-research-match.onrender.com"
echo "Checking every 4 minutes for new deployment (clean database with 0 labs)..."
echo ""

COUNTER=0
MAX_CHECKS=15  # 60 minutes max (15 checks × 4 min)

while [ $COUNTER -lt $MAX_CHECKS ]; do
  COUNTER=$((COUNTER + 1))
  TIMESTAMP=$(date '+%H:%M:%S')

  # Check if backend returns empty labs array
  RESPONSE=$(curl -s https://catalyst-research-match.onrender.com/api/labs 2>/dev/null)

  # Count number of labs
  LAB_COUNT=$(echo "$RESPONSE" | grep -o '"id":' | wc -l | tr -d ' ')

  if [ "$LAB_COUNT" -eq 0 ]; then
    echo ""
    echo "🎉 ✅ NEW DEPLOYMENT IS LIVE! ✅ 🎉"
    echo "⏰ Time: $TIMESTAMP"
    echo "📊 Labs in database: 0 (clean database confirmed)"
    echo ""
    echo "Backend URL: https://catalyst-research-match.onrender.com"
    echo "Database is now clean and ready for professors to add labs!"

    # macOS notification
    osascript -e 'display notification "Clean database deployment is live!" with title "Render Deployment Complete" sound name "Glass"' 2>/dev/null

    exit 0
  else
    echo "[$TIMESTAMP] Check $COUNTER/$MAX_CHECKS - Still old deployment ($LAB_COUNT labs) - waiting 4 minutes..."
    sleep 240
  fi
done

echo ""
echo "⚠️  Timeout: Deployment still not updated after 60 minutes"
echo "Check Render dashboard: https://dashboard.render.com"
