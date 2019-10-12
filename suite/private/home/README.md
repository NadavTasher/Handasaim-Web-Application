### Instructions for installing on digital signage devices
You will need to trigger the following command once, every login.
```
# Firefox (needs Auto FullScreen)
firefox --private-window https://handasaim.app
# Chromium
chromium --incognito --kiosk https://handasaim.app
```
#### Adding the command to startup script
```
# Chromium
mkdir ~/.config/autostart
echo [Desktop\ Entry] > ~/.config/autostart/Handasaim.desktop
echo Type=Application >> ~/.config/autostart/Handasaim.desktop
echo Exec=chromium\ --incognito\ --kiosk\ https://handasaim.app >> ~/.config/autostart/Handasaim.desktop
echo Hidden=false >> ~/.config/autostart/Handasaim.desktop
echo NoDisplay=false >> ~/.config/autostart/Handasaim.desktop
echo X-GNOME-Autostart-enabled=true >> ~/.config/autostart/Handasaim.desktop
echo Name=Handasaim+ >> ~/.config/autostart/Handasaim.desktop
# Firefox
mkdir ~/.config/autostart
echo [Desktop\ Entry] > ~/.config/autostart/Handasaim.desktop
echo Type=Application >> ~/.config/autostart/Handasaim.desktop
echo Exec=firefox\ --private-window\ https://handasaim.app >> ~/.config/autostart/Handasaim.desktop
echo Hidden=false >> ~/.config/autostart/Handasaim.desktop
echo NoDisplay=false >> ~/.config/autostart/Handasaim.desktop
echo X-GNOME-Autostart-enabled=true >> ~/.config/autostart/Handasaim.desktop
echo Name=Handasaim+ >> ~/.config/autostart/Handasaim.desktop
```
File contents:
```
# Chromium
[Desktop Entry]
Type=Application
Exec=chromium --incognito --kiosk https://handasaim.app
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=Handasaim+
# Firefox
[Desktop Entry]
Type=Application
Exec=firefox --private-window https://handasaim.app
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=Handasaim+
```
#### Uninstalling
```
rm ~/.config/autostart/Handasaim.desktop
```