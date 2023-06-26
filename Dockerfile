FROM node:18 as react-build

# Create app directory
WORKDIR /app

COPY . ./
RUN touch .env
RUN yarn
RUN yarn build

FROM --platform=linux/amd64 nginx:alpine
COPY --from=react-build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]
