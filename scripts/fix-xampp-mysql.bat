@echo off
echo Fixing XAMPP MySQL replication file corruption...
echo.

net stop mysql 2>nul

cd /d C:\xampp\mysql\data

if exist multi-master.info del /f /q multi-master.info
del /f /q master-* 2>nul
del /f /q relay-log-* 2>nul
del /f /q mysql-relay-bin-* 2>nul

echo Corrupted replication files removed.
echo Starting MySQL...
call C:\xampp\mysql_start.bat
