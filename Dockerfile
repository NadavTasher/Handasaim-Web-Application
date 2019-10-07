FROM php:7.0-apache

# Update package lists
RUN apt-get update
# Install libreoffice
RUN apt-get -y install libreoffice
# Copy apache2 host configuration
COPY configuration/000-default.conf /etc/apache2/sites-available/000-default.conf
# Copy ssl cerificates
COPY certificates /var/www/ssl
# Copy suite
COPY suite /var/www/html
# Change permissions and ownership
RUN chmod 775 /var/www/ -R
RUN chown www-data /var/www/ -R
# Enable apache2 mods
RUN a2enmod headers
RUN a2enmod ssl
# Restart apache2
RUN service apache2 restart