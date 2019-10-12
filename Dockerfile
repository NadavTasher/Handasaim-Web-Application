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
COPY configuration/000-default.conf /etc/apache2/sites-available/000-default.conf
# Copy suite
COPY suite /var/www/html
# Link upload and keyman authentication files
RUN ln -s /var/www/html/upload/files/authenticate /var/www/html/keyman/files/authenticate
# Change permissions and ownership
RUN chmod 775 /var/www/ -R
RUN chown www-data /var/www/ -R
# Enable apache2 mods
RUN a2enmod headers
RUN a2enmod rewrite
# Restart apache2
RUN service apache2 restart