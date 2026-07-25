# RASTA — tashqi kutubxonasiz ilova, shuning uchun образ juda yengil
FROM node:22-alpine

WORKDIR /app

# Faqat ilova kodi (npm install kerak emas — dependency yo'q)
COPY package.json ./
COPY src ./src
COPY public ./public

# Baza va yuklangan rasmlar shu katalogda saqlanadi (volume qilib ulang)
ENV RASTA_DATA_DIR=/data
ENV PORT=3000
RUN mkdir -p /data

VOLUME ["/data"]
EXPOSE 3000

# Baza bo'sh bo'lsa namuna ma'lumotlarni yuklab, so'ng serverni ishga tushiradi
CMD ["node", "--experimental-sqlite", "src/start.js"]
