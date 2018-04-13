## Query for Azure Stream Analytics
### Inputs: IoTHub
### Outputs: Three Azure Storage Blob Containers
```
SELECT * INTO BlobTrain5Gps FROM IothubInput WHERE GetType(alt) = 'nvarchar(max)' OR GetType(headingX) = 'nvarchar(max)'

SELECT * INTO BlobTrain5Acc FROM IothubInput WHERE GetType(accelX) = 'nvarchar(max)'

SELECT * INTO BlobTrain5Train FROM IothubInput WHERE GetType(passengerCount) = 'nvarchar(max)'
```
