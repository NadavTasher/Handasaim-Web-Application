FROM php:7.0-apache
# Update package lists
RUN apt-get update
RUN mkdir -p /usr/share/man/man1
# Install libreoffice
RUN apt-get -y install libreoffice
# Install java
RUN apt-get -y install openjdk-8-jre-headless ca-certificates-java
ENV JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF8
# Copy apache configuration
# Copy suite
COPY suite /var/www
# Link upload and keyman authentication files
RUN ln -s /var/www/private/upload/files/authenticate /var/www/private/keyman/files/authenticate
# Link private folders to public folders
# Change permissions and ownership
RUN chmod 775 /var/www/ -R
RUN chown www-data /var/www/ -R
# Enable apache2 mods
RUN a2enmod headers
RUN a2enmod rewrite
# Restart apache2
RUN service apache2 restart