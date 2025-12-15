# Node + Debian, чтобы был apt
FROM node:20-bullseye

# Ставим Python и pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Устанавливаем node-зависимости бэка
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Устанавливаем python-зависимости для инференса
COPY backend/python/requirements.txt ./backend/python/requirements.txt
RUN pip3 install -r backend/python/requirements.txt

# Копируем остальной код и модель
COPY backend ./backend

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "index.js"]
