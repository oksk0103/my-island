#!/data/data/com.termux/files/usr/bin/bash
# 루아 신문 아침 자동 인쇄 — 폴드4 Termux 설치 (v185)
# Termux에서 한 줄:  curl -sL https://oksk0103.github.io/my-island/gunggeum/tools/rua-print-setup.sh | bash
# 시각을 바꾸려면:   curl -sL .../rua-print-setup.sh | HOUR=7 MIN=10 bash
set -e
HOUR=${HOUR:-6}; MIN=${MIN:-50}
URL=https://oksk0103.github.io/my-island/gunggeum/tools/rua-print.py
echo "[1/4] 필요한 것 설치 (python, cron)"
echo "  (처음에는 3~5분 걸려요. 글자가 계속 올라가면 정상이에요)"
export DEBIAN_FRONTEND=noninteractive
O='-o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold'
yes | pkg update -y $O || true
yes | pkg install -y $O python cronie termux-services
echo "[2/4] 인쇄 프로그램 받기"
curl -sfL "$URL?t=$(date +%s)" -o ~/rua-print.py
echo "[3/4] 프린터 찾기"
python ~/rua-print.py probe || echo "  (프린터를 못 찾았어요. 같은 와이파이인지 보고 나중에: python ~/rua-print.py probe)"
echo "[4/4] 매일 ${HOUR}시 ${MIN}분부터 1시간 동안 10분마다 확인 (오늘 것은 한 번만 뽑음)"
M=$MIN; LIST=""; for i in 0 1 2 3 4 5; do LIST="$LIST $(( (HOUR*60+M+i*10) / 60 % 24 )):$(( (M+i*10) % 60 ))"; done
( crontab -l 2>/dev/null | grep -v rua-print.py
  for t in $LIST; do echo "${t#*:} ${t%%:*} * * * python \$HOME/rua-print.py >/dev/null 2>&1"; done
  echo "15 3 * * 0 curl -sfL $URL -o \$HOME/rua-print.py.new && mv \$HOME/rua-print.py.new \$HOME/rua-print.py"
) | crontab -
sv-enable crond 2>/dev/null || true
termux-wake-lock 2>/dev/null || true
echo
echo "끝! 확인:  python ~/rua-print.py test   (지금 바로 한 부 뽑기)"
echo "기록 보기: tail ~/rua-print.log"
echo "※ 'sv-enable' 오류가 나면 Termux를 완전히 껐다 켠 뒤 이 줄을 한 번 더 실행해 주세요."
