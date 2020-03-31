time=$(date "+%Y-%m-%d %H:%M:%S")
git add .
git commit -m "$1$time"
git push