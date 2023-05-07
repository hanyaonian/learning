# base image
FROM node:18

# working directory
# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# install dependencies
RUN npm install

# define the port number the container should expose
EXPOSE 3000

# run the command
# command for running the application
CMD ["npm", "run", "serve"]