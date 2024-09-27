FROM mysql:5.7
LABEL description="QuestApp MySQL Preset"

# Add a database
ENV MYSQL_DATABASE=questapp
ENV MYSQL_USER=questapp

# Change Timezone to UTc
ENV TZ=Etc/UTC

#Check out docker entry point for further configuration :
# https://github.com/docker-library/mysql
COPY init.sql /docker-entrypoint-initdb.d/