# Schedule Suite

Schedule Suite is a product suite that deals with displaying dynamic daily schedules for students and teachers.

## Installation
### Method 1: Using a docker exported image
Install [docker](https://www.docker.com/) on your machine.

Download the [latest](https://github.com/NadavTasher/ScheduleSuite/releases/latest) image then use the following commands:
```bash
gunzip -c ScheduleSuite.tar.gz | docker load
docker run -p 80:80 --name schedulesuite-container --restart unless-stopped -d schedulesuite
```
### Method 2: Building a docker image from source
Install [docker](https://www.docker.com/) on your machine.

[Clone the repository](https://github.com/NadavTasher/ScheduleSuite/archive/master.zip) or [download the latest release](https://github.com/NadavTasher/ScheduleSuite/releases/latest), enter the extracted directory, then run the following commands:
```bash
docker build . -t schedulesuite
docker run -p 80:80 --name schedulesuite-container --restart unless-stopped -d schedulesuite
```

## Usage
Before using the suite, you'll have to set it up.
Setting up is simple - just open `http://address/setup on` your phone or computer and follow the steps there.

Make sure you have an icon ready before setup.

The suite has a couple of endpoints:
1. `/home` - the schedule viewer, the application itself.
2. `/embed` - a simple Libreoffice exported HTML file to use in iframes.
3. `/keyman` - a key generator for teacher access (if disabled by `/setup`)
4. `/upload` - a page in which you upload a newer schedule, in an excel format.

## Contributing
Pull requests are welcome, but only for smaller changer.
For larger changes, open an issue so that we could discuss the change.

Bug reports and vulnerabilities are welcome too. 
## License
[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)