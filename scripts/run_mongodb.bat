net stop mongodb
mongod --port 27017 --dbpath "C:\Program Files\MongoDB\Server\6.0\data" --replSet rs0 --bind_ip localhost
@REM First run requires rs.initiate()