# base image
FROM node:18

WORKDIR /app

# copy all the files to the container
COPY . .

# install dependencies
RUN pnpm install

# ENV?
EXPOSE 3000

# run the command
# command for running the application
CMD ["pnpm", "--filter", "svr", "dev"]