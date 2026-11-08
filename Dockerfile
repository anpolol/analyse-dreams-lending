FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Site content: repo root is the document root, so lk/ is served at /lk/
COPY . /usr/share/nginx/html

# nginx.conf gets swept up by "COPY ." — keep it out of the public docroot
RUN rm /usr/share/nginx/html/nginx.conf